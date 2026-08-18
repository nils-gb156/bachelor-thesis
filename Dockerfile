# Dockerfile for https://github.com/andygrunwald/FOM-LaTeX-Template
#
# Example usage:
#   docker run -it --rm -v ${PWD}:/data andygrunwald/fom-latex-template
# 	or use 
#	docker-compose up

FROM ubuntu:26.04

# hadolint ignore=DL3008
RUN apt-get update \
	&& apt-get install -y \
		wget \
		texlive-latex-recommended \
		texlive-latex-extra \
		texlive-fonts-recommended \
		texlive-bibtex-extra \
		texlive-lang-german \
		texlive-plain-generic \
		texlive-luatex \
		biber \
		xz-utils \
		python3 \
		python3-pip \
		--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

# minted v3: Debian/TeX-Live 2025 liefert minted.sty v3.7.0, das mit Python 3.14
# (Ubuntu 26.04) inkompatibel ist (argparse-"color"-Absturz von latexminted <=0.5).
# Die Python-3.14-tauglichen latexminted (>=0.7) verlangen jedoch minted.sty >= 3.8.
# Deshalb den minted-Stack (minted, fvextra, latex2pydata) aus CTAN auf die aktuelle
# Version heben und die im minted-Paket gebuendelten, zueinander passenden Python-
# Wheels (latexminted, latexrestricted, latex2pydata, pygments) installieren.
# hadolint ignore=DL3013
RUN set -eux; \
	cd /tmp; \
	wget -q https://mirrors.ctan.org/macros/latex/contrib/minted.zip; \
	wget -q https://mirrors.ctan.org/macros/latex/contrib/fvextra.zip; \
	wget -q https://mirrors.ctan.org/macros/latex/contrib/latex2pydata.zip; \
	for p in minted fvextra latex2pydata; do \
		python3 -c "import zipfile; zipfile.ZipFile('/tmp/$p.zip').extractall('/tmp')"; \
	done; \
	( cd /tmp/minted && tex -interaction=nonstopmode minted.ins ); \
	( cd /tmp/fvextra && tex -interaction=nonstopmode fvextra.ins ); \
	( cd /tmp/latex2pydata && tex -interaction=nonstopmode latex2pydata.ins ); \
	mkdir -p /usr/local/share/texmf/tex/latex/minted \
		/usr/local/share/texmf/tex/latex/fvextra \
		/usr/local/share/texmf/tex/latex/latex2pydata; \
	cp /tmp/minted/minted.sty /tmp/minted/minted1.sty /tmp/minted/minted2.sty \
		/usr/local/share/texmf/tex/latex/minted/; \
	cp /tmp/fvextra/fvextra.sty /usr/local/share/texmf/tex/latex/fvextra/; \
	cp /tmp/latex2pydata/latex2pydata.sty /usr/local/share/texmf/tex/latex/latex2pydata/; \
	pip3 install --break-system-packages --no-cache-dir \
		/tmp/minted/latexminted-*.whl \
		/tmp/minted/latexrestricted-*.whl \
		/tmp/minted/latex2pydata-*.whl \
		/tmp/minted/pygments-*.whl; \
	mktexlsr /usr/local/share/texmf; \
	rm -rf /tmp/minted /tmp/fvextra /tmp/latex2pydata /tmp/*.zip

# This can get removed at some point due to docker-compose
VOLUME ["/data"]

WORKDIR /data

COPY ./compile.sh /compile.sh

RUN chmod +x /compile.sh

ENTRYPOINT ["./compile.sh"]

CMD ["lualatex", "--version"]
# CMD ["biber" "--version"]
