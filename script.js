$(function () {
    let formularzWidoczny = false;
    let edytowanaNotatka = null;

    const dostepneKategorie = [
        "DOM", "PRACA", "SZKOLA", "ZAKUPY",
        "FINANSE", "ZDROWIE", "INNE"
    ];

    function aktualizujPrzycisk() {
        const ok =
            $("#tytul").val().trim().length > 0 &&
            $("#tresc").val().trim().length > 0 &&
            dostepneKategorie.includes($("#kategoria").val());

        $("#addNote").prop("disabled", !ok);
    }

    function filtrujNotatki() {
        const szukane = $("#szukajDanych").val().toLowerCase().trim();
        const kategoria = $("#filtrujKategorie").val().toLowerCase();
        let znalezione = 0;
        const wszystkie = $(".notatka").length;

        $(".notatka").each(function () {
            const tekst = $(this).text().toLowerCase();
            const pasujeTekst = tekst.includes(szukane);
            const pasujeKategoria = kategoria === "" || $(this).hasClass(kategoria);

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

    $("#pokazFormularz").on("click", function () {
        formularzWidoczny = !formularzWidoczny;
        $("#formularzNotatki").toggle(800);
        $(this).text(formularzWidoczny ? "Schowaj formularz" : "+ Dodaj notatkę");
    });

    $("#szukajDanych").on("input", filtrujNotatki);
    $("#filtrujKategorie").on("change", filtrujNotatki);

    $("#tytul").on("input", function () {
        const dl = $(this).val().trim().length;
        $("#licznikTytulu").text(dl + "/40");

        if (dl === 0) {
            $("#bladTytulu").text("Tytuł jest wymagany").css("color", "red");
        } else if (dl > 40) {
            $("#bladTytulu").text("Za dużo znaków").css("color", "red");
        } else {
            $("#bladTytulu").text("OK").css("color", "green");
        }
        aktualizujPrzycisk();
    });

    $("#tresc").on("input", function () {
        const dl = $(this).val().trim().length;

        if (dl === 0) {
            $("#bladTresci").text("Treść jest wymagana").css("color", "red");
        } else if (dl > 500) {
            $("#bladTresci").text("Za dużo znaków").css("color", "red");
        } else {
            $("#bladTresci").text("OK").css("color", "green");
        }
        aktualizujPrzycisk();
    });

    $("#kategoria").on("change", function () {
        if (dostepneKategorie.includes($(this).val())) {
            $("#bladKategorii").text("OK").css("color", "green");
        } else {
            $("#bladKategorii").text("Wybierz kategorię").css("color", "red");
        }
        aktualizujPrzycisk();
    });

    $("#formularzNotatki").on("submit", function (e) {
        e.preventDefault();

        const tytul = $("#tytul").val().trim();
        const tresc = $("#tresc").val().trim();
        const kategoria = $("#kategoria").val();
        const nazwaKategorii = $("#kategoria option:selected").text();
        let poprawny = true;

        if (!tytul || tytul.length > 40) {
            $("#bladTytulu").text("Tytuł musi mieć od 1 do 40 znaków").css("color", "red");
            poprawny = false;
        } else {
            $("#bladTytulu").text("");
        }

        if (!tresc || tresc.length > 500) {
            $("#bladTresci").text("Treść musi mieć od 1 do 500 znaków").css("color", "red");
            poprawny = false;
        } else {
            $("#bladTresci").text("");
        }

        if (!dostepneKategorie.includes(kategoria)) {
            $("#bladKategorii").text("Kategoria jest wymagana").css("color", "red");
            poprawny = false;
        } else {
            $("#bladKategorii").text("");
        }

        if (!poprawny) return;

        const klasaKategorii = kategoria.toLowerCase();

        if (edytowanaNotatka) {
            edytowanaNotatka.find("h3").text(tytul);
            edytowanaNotatka.find("span").text(nazwaKategorii);
            edytowanaNotatka.find("p").text(tresc);
            edytowanaNotatka.data("kategoria", kategoria);
            edytowanaNotatka
                .removeClass("dom praca szkola zakupy finanse zdrowie inne")
                .addClass(klasaKategorii);
            edytowanaNotatka = null;
        } else {
            const notatka = $("<div>")
                .addClass("notatka " + klasaKategorii)
                .data("kategoria", kategoria);

            const h3 = $("<h3>").text(tytul).on("click", function () {
                p.toggle();
            });
            const span = $("<span>").text(nazwaKategorii);
            const p = $("<p>").text(tresc);

            const btnEdytuj = $("<button>", { type: "button", class: "edycja", text: "Edytuj" })
                .on("click", function () {
                    edytowanaNotatka = notatka;
                    $("#tytul").val(h3.text());
                    $("#tresc").val(p.text());
                    $("#kategoria").val(notatka.data("kategoria"));
                    $("#licznikTytulu").text(h3.text().length + "/40");
                    $("#formularzNotatki").show(400);
                    $("#pokazFormularz").text("Schowaj formularz");
                    formularzWidoczny = true;
                    aktualizujPrzycisk();
                });

            const btnUsun = $("<button>", { type: "button", class: "usun", text: "Usuń" })
                .on("click", function () {
                    if (edytowanaNotatka === notatka) edytowanaNotatka = null;
                    notatka.remove();
                    filtrujNotatki();
                });

            notatka.append(h3, span, p, btnEdytuj, btnUsun);
            $(".tablica").append(notatka);
        }

        $("#tytul, #tresc, #kategoria").val("");
        $("#licznikTytulu").text("0/40");
        $("#bladTytulu, #bladTresci, #bladKategorii").text("");
        aktualizujPrzycisk();
        filtrujNotatki();
    });

    $(".darkMode").on("click", function () {
        $("body").toggleClass("dark-mode");
    });

    aktualizujPrzycisk();
    filtrujNotatki();
});