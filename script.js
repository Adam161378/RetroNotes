
$(function () {

    let czyFormularzWidoczny = false;
    let edytowanaNotatka = null;

    const dostepneKategorie = [
        "DOM", "PRACA", "SZKOLA", "ZAKUPY",
        "FINANSE", "ZDROWIE", "INNE"
    ];

    function aktualizujStanPrzyciskuDodawania() {
        const czyTytulWypelniony = $("#tytul").val().trim().length > 0;
        const czyTrescWypelniona = $("#tresc").val().trim().length > 0;
        const czyKategoriaWybrana = dostepneKategorie.includes($("#kategoria").val());

        const czyFormularzPoprawny = czyTytulWypelniony && czyTrescWypelniona && czyKategoriaWybrana;

        $("#addNote").prop("disabled", !czyFormularzPoprawny);
    }

    function filtrujNotatkiWedlugTekstuIKategorii() {
        const szukanyTekst = $("#szukajDanych").val().toLowerCase().trim();
        const wybranaKategoria = $("#filtrujKategorie").val().toLowerCase();

        let liczbaZnalezionychNotatek = 0;
        const liczbaWszystkichNotatek = $(".notatka").length;

        $(".notatka").each(function () {
            const tekstNotatki = $(this).text().toLowerCase();
            const czyTekstPasuje = tekstNotatki.includes(szukanyTekst);
            const czyKategoriaPasuje = wybranaKategoria === "" || $(this).hasClass(wybranaKategoria);

            if (czyTekstPasuje && czyKategoriaPasuje) {
                $(this).show();
                liczbaZnalezionychNotatek++;
            } else {
                $(this).hide();
            }
        });

        $("#liczbaNotatek").text("Znaleziono: " + liczbaZnalezionychNotatek + " / " + liczbaWszystkichNotatek + " notatek");
    }

    $("#pokazFormularz").on("click", function () {
        czyFormularzWidoczny = !czyFormularzWidoczny;

        $("#formularzNotatki").toggle(800);

        if (czyFormularzWidoczny) {
            $(this).text("Schowaj formularz");
        } else {
            $(this).text("+ Dodaj notatkę");
        }
    });

    $("#szukajDanych").on("input", filtrujNotatkiWedlugTekstuIKategorii);
    $("#filtrujKategorie").on("change", filtrujNotatkiWedlugTekstuIKategorii);

    $("#tytul").on("input", function () {
        const dlugoscTytulu = $(this).val().trim().length;
        $("#licznikTytulu").text(dlugoscTytulu + "/40");

        if (dlugoscTytulu === 0) {
            $("#bladTytulu").text("Tytuł jest wymagany").css("color", "red");
        } else if (dlugoscTytulu > 40) {
            $("#bladTytulu").text("Za dużo znaków").css("color", "red");
        } else {
            $("#bladTytulu").text("OK").css("color", "green");
        }

        aktualizujStanPrzyciskuDodawania();
    });

    $("#tresc").on("input", function () {
        const dlugoscTresci = $(this).val().trim().length;

        if (dlugoscTresci === 0) {
            $("#bladTresci").text("Treść jest wymagana").css("color", "red");
        } else if (dlugoscTresci > 500) {
            $("#bladTresci").text("Za dużo znaków").css("color", "red");
        } else {
            $("#bladTresci").text("OK").css("color", "green");
        }

        aktualizujStanPrzyciskuDodawania();
    });

    $("#kategoria").on("change", function () {
        if (dostepneKategorie.includes($(this).val())) {
            $("#bladKategorii").text("OK").css("color", "green");
        } else {
            $("#bladKategorii").text("Wybierz kategorię").css("color", "red");
        }

        aktualizujStanPrzyciskuDodawania();
    });

    $("#formularzNotatki").on("submit", function (zdarzenie) {
        zdarzenie.preventDefault();

        const tytulNotatki = $("#tytul").val().trim();
        const trescNotatki = $("#tresc").val().trim();
        const wybranaKategoria = $("#kategoria").val();
        const nazwaKategorii = $("#kategoria option:selected").text();

        let czyFormularzPoprawny = true;

        if (!tytulNotatki || tytulNotatki.length > 40) {
            $("#bladTytulu").text("Tytuł musi mieć od 1 do 40 znaków").css("color", "red");
            czyFormularzPoprawny = false;
        } else {
            $("#bladTytulu").text("");
        }

        if (!trescNotatki || trescNotatki.length > 500) {
            $("#bladTresci").text("Treść musi mieć od 1 do 500 znaków").css("color", "red");
            czyFormularzPoprawny = false;
        } else {
            $("#bladTresci").text("");
        }

        if (!dostepneKategorie.includes(wybranaKategoria)) {
            $("#bladKategorii").text("Kategoria jest wymagana").css("color", "red");
            czyFormularzPoprawny = false;
        } else {
            $("#bladKategorii").text("");
        }

        if (!czyFormularzPoprawny) return;

        const klasaKategorii = wybranaKategoria.toLowerCase();

        if (edytowanaNotatka) {
            edytowanaNotatka.find("h3").text(tytulNotatki);
            edytowanaNotatka.find("span").text(nazwaKategorii);
            edytowanaNotatka.find("p").text(trescNotatki);
            edytowanaNotatka.data("kategoria", wybranaKategoria);

            edytowanaNotatka.removeClass("dom praca szkola zakupy finanse zdrowie inne").addClass(klasaKategorii);

            edytowanaNotatka = null;

        } else {
            const nowaNotatka = $("<div>").addClass("notatka " + klasaKategorii).data("kategoria", wybranaKategoria);

            const elementTytuluNotatki = $("<h3>").text(tytulNotatki).on("click", function () {
                elementTresciNotatki.toggle();
            });

            const elementKategoriiNotatki = $("<span>").text(nazwaKategorii);
            const elementTresciNotatki = $("<p>").text(trescNotatki);

            const przyciskEdytujNotatke = $("<button>", {
                type: "button",
                class: "edycja",
                text: "Edytuj"
            }).on("click", function () {
                edytowanaNotatka = nowaNotatka;

                $("#tytul").val(elementTytuluNotatki.text());
                $("#tresc").val(elementTresciNotatki.text());
                $("#kategoria").val(nowaNotatka.data("kategoria"));
                $("#licznikTytulu").text(elementTytuluNotatki.text().length + "/40");

                $("#formularzNotatki").show(400);
                $("#pokazFormularz").text("Schowaj formularz");

                czyFormularzWidoczny = true;
                aktualizujStanPrzyciskuDodawania();
            });

            const przyciskUsunNotatke = $("<button>", {
                type: "button",
                class: "usun",
                text: "Usuń"
            }).on("click", function () {
                if (edytowanaNotatka === nowaNotatka) {
                    edytowanaNotatka = null;
                }

                nowaNotatka.remove();
                filtrujNotatkiWedlugTekstuIKategorii();
            });

            nowaNotatka.append(elementTytuluNotatki, elementKategoriiNotatki, elementTresciNotatki, przyciskEdytujNotatke, przyciskUsunNotatke);
            $(".tablica").append(nowaNotatka);
        }

        $("#tytul, #tresc, #kategoria").val("");
        $("#licznikTytulu").text("0/40");
        $("#bladTytulu, #bladTresci, #bladKategorii").text("");

        aktualizujStanPrzyciskuDodawania();
        filtrujNotatkiWedlugTekstuIKategorii();
    });

    $(".darkMode").on("click", function () {
        $("body").toggleClass("dark-mode");
    });

    aktualizujStanPrzyciskuDodawania();
    filtrujNotatkiWedlugTekstuIKategorii();

});
