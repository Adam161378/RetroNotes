
$(function() {

    let formularzWidoczny = false;

    let dostepneKategorie = [
        "DOM", "PRACA", "SZKOLA", "ZAKUPY",
        "FINANSE", "ZDROWIE", "INNE"
    ];

    let edytowanaNotatka = null;
    let edytowanyTytul = null;
    let edytowanaTresc = null;
    let edytowanaKategoria = null;
    let edytowanaWartoscKategorii = null;

    $("#pokazFormularz").click(function() {

        if (formularzWidoczny === false) {

            $("#formularzNotatki").show(400);
            $(this).text("- Schowaj formularz");
            formularzWidoczny = true;

        } else {

            $("#formularzNotatki").hide(400);
            $(this).text("+ Dodaj notatkę");
            formularzWidoczny = false;

        }

    });

    function filtrujNotatki() {

        let szukane = $("#szukajDanych").val().toLowerCase();
        let wybranaKategoria = $("#filtrujKategorie").val().toLowerCase();

        let znalezione = 0;
        let wszystkie = 0;

        $(".notatka").each(function() {

            let tekst = $(this).text().toLowerCase();
            let klasy = $(this).attr("class").toLowerCase();

            let pasujeTekst = false;
            let pasujeKategoria = false;

            for (let i = 0; i <= tekst.length - szukane.length; i++) {

                let zgodne = true;

                for (let j = 0; j < szukane.length; j++) {

                    if (tekst[i + j] !== szukane[j]) {
                        zgodne = false;
                    }

                }

                if (zgodne === true) {
                    pasujeTekst = true;
                }

            }

            if (wybranaKategoria === "") {

                pasujeKategoria = true;

            } else {

                for (let i = 0; i <= klasy.length - wybranaKategoria.length; i++) {

                    let zgodne = true;

                    for (let j = 0; j < wybranaKategoria.length; j++) {

                        if (klasy[i + j] !== wybranaKategoria[j]) {
                            zgodne = false;
                        }

                    }

                    if (zgodne === true) {
                        pasujeKategoria = true;
                    }

                }

            }

            if (pasujeTekst && pasujeKategoria) {

                $(this).show();
                znalezione++;

            } else {

                $(this).hide();

            }

            wszystkie++;

        });

        $("#liczbaNotatek").text(
            "Znaleziono: " + znalezione + " / " + wszystkie + " notatek"
        );

    }

    $("#szukajDanych").on("input", function() {
        filtrujNotatki();
    });

    $("#filtrujKategorie").change(function() {
        filtrujNotatki();
    });

    $("#kategoria").change(function() {

        if ($("#kategoria").val() !== "") {

            $("#bladKategorii").text("OK").css("color", "green");

        } else {

            $("#bladKategorii").text("Wybierz kategorię").css("color", "red");

        }

    });

    $("#formularzNotatki").submit(function(e) {

        e.preventDefault();

        let tytul = $("#tytul").val().trim();
        let tresc = $("#tresc").val().trim();
        let kategoria = $("#kategoria").val();
        let nazwaKategorii = $("#kategoria option:selected").text();

        let poprawny = true;
        let poprawnaKategoria = false;

        if (tytul === "") {

            $("#bladTytulu").text("Tytuł jest wymagany").css("color", "red");
            poprawny = false;

        } else if (tytul.length > 40) {

            $("#bladTytulu").text("Tytuł może mieć maksymalnie 40 znaków").css("color", "red");
            poprawny = false;

        } else {

            $("#bladTytulu").text("");

        }

        if (tresc === "") {

            $("#bladTresci").text("Treść jest wymagana").css("color", "red");
            poprawny = false;

        } else if (tresc.length > 500) {

            $("#bladTresci").text("Treść może mieć maksymalnie 500 znaków").css("color", "red");
            poprawny = false;

        } else {

            $("#bladTresci").text("");

        }

        for (let i = 0; i < dostepneKategorie.length; i++) {

            if (kategoria === dostepneKategorie[i]) {
                poprawnaKategoria = true;
            }

        }

        if (poprawnaKategoria === false) {

            $("#bladKategorii").text("Wybierz kategorię").css("color", "red");
            poprawny = false;

        } else {

            $("#bladKategorii").text("OK").css("color", "green");

        }

        if (poprawny === false) {
            return;
        }

        if (edytowanaNotatka !== null) {

            edytowanyTytul.text(tytul);
            edytowanaTresc.text(tresc);
            edytowanaKategoria.text(nazwaKategorii);

            edytowanaNotatka.removeClass(
                "dom praca szkola zakupy finanse zdrowie inne"
            );

            edytowanaNotatka.addClass(kategoria.toLowerCase());

            edytowanaWartoscKategorii = null;
            edytowanaNotatka = null;
            edytowanyTytul = null;
            edytowanaTresc = null;
            edytowanaKategoria = null;

        } else {

            let nowaNotatka = $("<div>");
            nowaNotatka.addClass("notatka");
            nowaNotatka.addClass(kategoria.toLowerCase());

            let tytulNotatki = $("<h3>");
            tytulNotatki.text(tytul);

            let kategoriaNotatki = $("<span>");
            kategoriaNotatki.text(nazwaKategorii);

            let trescNotatki = $("<p>");
            trescNotatki.text(tresc);

            let przyciskEdycji = $("<button>");
            przyciskEdycji.attr("type", "button");
            przyciskEdycji.addClass("edycja");
            przyciskEdycji.text("Edytuj");

            przyciskEdycji.click(function() {

                edytowanaNotatka = nowaNotatka;

                edytowanyTytul = tytulNotatki;
                edytowanaTresc = trescNotatki;
                edytowanaKategoria = kategoriaNotatki;
                edytowanaWartoscKategorii = kategoria.toUpperCase();

                $("#tytul").val(tytulNotatki.text());
                $("#tresc").val(trescNotatki.text());
                $("#kategoria").val(edytowanaWartoscKategorii);

                $("#formularzNotatki").show(400);
                $("#pokazFormularz").text("- Schowaj formularz");
                formularzWidoczny = true;

            });

            let przyciskUsuwania = $("<button>");
            przyciskUsuwania.attr("type", "button");
            przyciskUsuwania.addClass("usun");
            przyciskUsuwania.text("Usuń");

            przyciskUsuwania.click(function() {

                nowaNotatka.remove();

                if (edytowanaNotatka === nowaNotatka) {

                    edytowanaNotatka = null;
                    edytowanyTytul = null;
                    edytowanaTresc = null;
                    edytowanaKategoria = null;
                    edytowanaWartoscKategorii = null;

                }

                filtrujNotatki();

            });

            nowaNotatka.append(
                tytulNotatki,
                kategoriaNotatki,
                trescNotatki,
                przyciskEdycji,
                przyciskUsuwania
            );

            $(".tablica").append(nowaNotatka);

        }

        $("#tytul").val("");
        $("#tresc").val("");
        $("#kategoria").val("");

        $("#licznikTytulu").text("0/40");

        $("#bladTytulu").text("");
        $("#bladTresci").text("");
        $("#bladKategorii").text("");

        filtrujNotatki();

    });

    $("#tytul").on("input", function() {

        let dlugosc = $(this).val().length;

        $("#licznikTytulu").text(dlugosc + "/40");

        if (dlugosc === 0) {

            $("#bladTytulu").text("Tytuł jest wymagany").css("color", "red");
            $("#licznikTytulu").css("color", "red");

        } else if (dlugosc > 40) {

            $("#bladTytulu").text("Za dużo znaków").css("color", "red");
            $("#licznikTytulu").css("color", "red");

        } else {

            $("#bladTytulu").text("OK").css("color", "green");
            $("#licznikTytulu").css("color", "green");

        }

    });

    $("#tresc").on("input", function() {

        let dlugosc = $(this).val().trim().length;

        if (dlugosc === 0) {

            $("#bladTresci").text("Treść jest wymagana").css("color", "red");

        } else if (dlugosc > 500) {

            $("#bladTresci").text("Za dużo znaków").css("color", "red");

        } else {

            $("#bladTresci").text("OK").css("color", "green");

        }

    });

    filtrujNotatki();

});
