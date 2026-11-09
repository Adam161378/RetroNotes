$(function() {
    let formularzWidoczny = false;
    let dostepneKategorie = ["DOM", "PRACA", "SZKOLA", "ZAKUPY", "FINANSE", "ZDROWIE", "INNE"];

    let zapisywanie = false;
    let edytowanaNotatka = null;
    let edytowanyTytul = null, edytowanaTresc = null, edytowanaKategoria = null, staraKategoria = null;

    $("#pokazFormularz").on("click", function() {
        if (formularzWidoczny === false) {
            $("#formularzNotatki").show(1000);
            $(this).text("Schowaj formularz");
            formularzWidoczny = true;
        } else {
            $("#formularzNotatki").hide(1000);
            $(this).text("+ Dodaj notatkę");
            formularzWidoczny = false;
        }
    });

    $("#formularzNotatki").on("submit", function(e) {
        e.preventDefault();
        if (zapisywanie === true) {
            return;
        }

        let tytul = $("#tytul").val().trim();
        let tresc = $("#tresc").val().trim();
        let kategoria = $("#kategoria").val();
        let nazwaKategorii = $("#kategoria option:selected").text();

        let poprawnyTytul = false;
        if (tytul.length > 0 && tytul.length <= 40) {
            poprawnyTytul = true;
        }

        let poprawnaTresc = false;
        if (tresc.length > 0 && tresc.length <= 500) {
            poprawnaTresc = true;
        }

        let poprawnaKat = false;
        if (dostepneKategorie.includes(kategoria)) {
            poprawnaKat = true;
        }

        if (poprawnyTytul === false || poprawnaTresc === false || poprawnaKat === false) {
            return;
        }

        zapisywanie = true;
        $("#addNote").prop("disabled", true);

        if (edytowanaNotatka !== null) {
            edytowanyTytul.text(tytul);
            edytowanaTresc.text(tresc);
            edytowanaKategoria.text(nazwaKategorii);

            edytowanaNotatka.removeClass(staraKategoria.toLowerCase()).addClass(kategoria.toLowerCase());

            edytowanaNotatka = null;
            edytowanyTytul = null;
            edytowanaTresc = null;
            edytowanaKategoria = null;
            staraKategoria = null;
        } else {
            let nowaNotatka = $("<div>").addClass("notatka " + kategoria.toLowerCase());
            let tytulNotatki = $("<h3>").text(tytul);
            let kategoriaNotatki = $("<span>").text(nazwaKategorii);
            let trescNotatki = $("<p>").text(tresc);

            let buttonEdycji = $("<button>").attr("type", "button").addClass("edycja").text("Edytuj");
            buttonEdycji.click(function() {
                edytowanaNotatka = nowaNotatka;
                edytowanyTytul = tytulNotatki;
                edytowanaTresc = trescNotatki;
                edytowanaKategoria = kategoriaNotatki;
                staraKategoria = kategoria;

                $("#tytul").val(tytulNotatki.text());
                $("#tresc").val(trescNotatki.text());
                $("#kategoria").val(kategoria);

                if (formularzWidoczny === false) {
                    $("#formularzNotatki").show(1000);
                    $("#pokazFormularz").text("Schowaj formularz");
                    formularzWidoczny = true;
                }
            });

            let buttonUsuwania = $("<button>").attr("type", "button").addClass("usun").text("Usuń");
            buttonUsuwania.click(function() {
                nowaNotatka.remove();
                if (edytowanaNotatka === nowaNotatka) {
                    edytowanaNotatka = null;
                    edytowanyTytul = null;
                    edytowanaTresc = null;
                    edytowanaKategoria = null;
                    staraKategoria = null;
                }
            });

            nowaNotatka.append(tytulNotatki, kategoriaNotatki, trescNotatki, buttonEdycji, buttonUsuwania);
            $(".tablica").append(nowaNotatka);
        }

        $("#formularzNotatki")[0].reset();
        $("#bladTytulu").text("");
        $("#bladTresci").text("");
        $("#bladKategorii").text("");
        $("#licznikTytulu").text("0/40").css("color", "");

        zapisywanie = false;
        $("#addNote").prop("disabled", false);
    });

    $("#tytul").on("input", function() {
        let dlugosc = $(this).val().trim().length;
        $("#licznikTytulu").text(dlugosc + "/40");

        if (dlugosc === 0) {
            $("#bladTytulu").text("Tytuł nie może być pusty").css("color", "red");
            $("#licznikTytulu").css("color", "red");
        } else {
            if (dlugosc > 40) {
                $("#bladTytulu").text("Tytuł może mieć maksymalnie 40 znaków").css("color", "red");
                $("#licznikTytulu").css("color", "red");
            } else {
                $("#bladTytulu").text("Zaakceptowano").css("color", "green");
                $("#licznikTytulu").css("color", "green");
            }
        }
    });

    $("#tresc").on("input", function() {
        let dlugosc = $(this).val().trim().length;

        if (dlugosc === 0) {
            $("#bladTresci").text("Treść nie może być pusta").css("color", "red");
        } else {
            if (dlugosc > 500) {
                $("#bladTresci").text("Treść może mieć maksymalnie 500 znaków").css("color", "red");
            } else {
                $("#bladTresci").text("Zaakceptowano").css("color", "green");
            }
        }
    });

    $("#kategoria").on("change", function() {
        let kategoria = $(this).val();
        if (dostepneKategorie.includes(kategoria)) {
            $("#bladKategorii").text("");
        } else {
            $("#bladKategorii").text("Wybierz kategorię").css("color", "red");
        }
    });
});