IF "%1" == "en" (
    lualatex --shell-escape --jobname=thesis_englisch  "\def\FOMEN{}\input{thesis_main.tex}"
    biber thesis_englisch
    lualatex --shell-escape --jobname=thesis_englisch  "\def\FOMEN{}\input{thesis_main.tex}"
    lualatex --shell-escape --jobname=thesis_englisch  "\def\FOMEN{}\input{thesis_main.tex}"
    thesis_englisch.pdf
) ELSE (
    lualatex --shell-escape thesis_main.tex
    biber thesis_main
    lualatex --shell-escape thesis_main.tex
    lualatex --shell-escape thesis_main.tex
    thesis_main.pdf
)
del *.bbl /f /q
del *.blg /f /q
del *.aux /f /q
del *.bcf /f /q
del *.ilg /f /q
del *.lof /f /q
del *.log /f /q
del *.lot /f /q
del *.nlo /f /q
del *.nls* /f /q
del *.out /f /q
del *.toc /f /q
del *.run.xml /f /q
del *.lot /f /q
