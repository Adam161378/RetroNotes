$(function() {

    let formularzWidoczny = false;
    let edytowanaNotatka = null;

    let dostepneKategorie = [
        "DOM", "PRACA", "SZKOLA", "ZAKUPY",
        "FINANSE", "ZDROWIE", "INNE"
    ];

    $("#pokazFormularz").click(function() {
        if (formularzWidoczny) {
            $("#formularzNotatki").hide(600);
            $(this).text("+ Dodaj notatkę");
        } else {
            $("#formularzNotatki").show(600);
            $(this).text("Schowaj formularz");
        }
        formularzWidoczny = !formularzWidoczny;
    });

    function filtrujNotatki() {
        let szukane = $("#szukajDanych").val().toLowerCase();
        let kategoria = $("#filtrujKategorie").val().toLowerCase();
        let znalezione = 0;
        let wszystkie = $(".notatka").length;

        $(".notatka").each(function() {
            let tekst = $(this).text().toLowerCase();
            let klasy = $(this).attr("class");
            let pasujeTekst = tekst.includes(szukane);
            let pasujeKategoria = kategoria === "" || klasy.split(" ").includes(kategoria);

            if (pasujeTekst && pasujeKategoria) {
                $(this).show();
                znalezione++;
            } else {
                $(this).hide();
            }
        });

        $("#liczbaNotatek").text(
            "Znaleziono: " + znalezione + " / " + wszystkie + " notatek"
        );
    }

    $("#szukajDanych").on("input", filtrujNotatki);
    $("#filtrujKategorie").change(filtrujNotatki);

    $("#kategoria").change(function() {
        if ($(this).val() !== "") {
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

        if (!dostepneKategorie.includes(kategoria)) {
            $("#bladKategorii").text("Kategoria jest wymagana").css("color", "red");
            poprawny = false;
        } else {
            $("#bladKategorii").text("OK").css("color", "green");
        }

        if (!poprawny) {
            return;
        }

        if (edytowanaNotatka !== null) {
            edytowanaNotatka.find("h3").text(tytul);
            edytowanaNotatka.find("span").text(nazwaKategorii);
            edytowanaNotatka.find("p").text(tresc);

            edytowanaNotatka.removeClass(
                "dom praca szkola zakupy finanse zdrowie inne"
            );
            edytowanaNotatka.addClass(kategoria.toLowerCase());
            edytowanaNotatka = null;
        } else {
            let nowaNotatka = $("<div>");
            nowaNotatka.addClass("notatka " + kategoria.toLowerCase());

            let tytulNotatki = $("<h3>").text(tytul);
            let kategoriaNotatki = $("<span>").text(nazwaKategorii);
            let trescNotatki = $("<p>").text(tresc);

            tytulNotatki.click(function() {
                trescNotatki.toggle();
            });

            let przyciskEdycji = $("<button>");
            przyciskEdycji.attr("type", "button");
            przyciskEdycji.addClass("edycja");
            przyciskEdycji.text("Edytuj");

            przyciskEdycji.click(function() {
                edytowanaNotatka = nowaNotatka;
                $("#tytul").val(tytulNotatki.text());
                $("#tresc").val(trescNotatki.text());
                $("#kategoria").val(kategoria.toUpperCase());
                $("#formularzNotatki").show(400);
                $("#pokazFormularz").text("Schowaj formularz");
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

    $(".darkMode").on("click", function() {
        $("body").toggleClass("dark-mode");
    });
});