define(function () {
    "use strict";
    //Deklarerer navn
    function DataCristin() {};
    //Init
    DataCristin.prototype.initialize = function (oControlHost, fnDoneInitializing) {
        fnDoneInitializing();
    };


    //Opptegning av elementene
    DataCristin.prototype.draw = function (oControlHost) {

        // henting av verdi fra prompt
        var promptControls = oControlHost.page.getAllPromptControls();
        var promptVerdi = promptControls[0].getValues(true)[0];
        var urlPARAM = promptVerdi.use;

        //importerer jQuery
        var script = document.createElement('script');
        script.src = 'http://code.jquery.com/jquery-3.4.1.min.js';
        script.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);

        var section = document.createElement('div');

        //lager variabler for dagens dato og tilsvarende dato i fjor
        var someDay = new Date();
        var today = someDay.toISOString().slice(0, 10);
        var lastYearDate = new Date();
        lastYearDate.setFullYear(someDay.getFullYear() - 1);
        lastYearDate = lastYearDate.toISOString().slice(0, 10);

        //bestemmer Cristin-enheten basert på kode i DVH
        const unitVerdier = {
            806: '194.35.5.0',
            803: '194.33.0.0',
            815: '194.62.1.0',
            1082: '194.62.70.0',
            1081: '194.62.65.0',
            821: '194.62.35.0',
            823: '194.62.45.0',
            1080: '194.62.60.0',
            822: '194.62.40.0',
            808: '194.61.1.0',
            1213: '194.61.50.0',
            1214: '194.61.55.0',
            840: '194.61.45.0',
            813: '194.61.30.0',
            826: '194.63.1.0',
            827: '194.63.10.0',
            832: '194.63.35.0',
            829: '194.63.20.0',
            1215: '194.63.55.0',
            831: '194.63.30.0',
            828: '194.63.15.0',
            830: '194.63.25.0',
            1217: '194.64.91.0',
            839: '194.64.25.0',
            1216: '194.64.90.0',
            1219: '194.64.93.0',
            843: '194.64.45.0',
            838: '194.64.20.0',
            1218: '194.64.92.0',
            1220: '194.64.94.0',
            835: '194.64.1.0',
            1102: '194.65.70.0',
            1130: '194.65.80.0',
            852: '194.65.15.0',
            855: '194.65.30.0',
            1228: '194.65.35.0',
            853: '194.65.20.0',
            854: '194.65.25.0',
            1074: '194.65.60.0',
            850: '194.65.1.0',
            858: '194.65.35.5',
            1221: '194.66.50.0',
            1164: '194.66.40.0',
            865: '194.66.10.0',
            1134: '194.66.45.0',
            866: '194.66.15.0',
            867: '194.66.20.0',
            868: '194.66.25.0',
            869: '194.66.30.0',
            870: '194.66.35.0',
            864: '194.66.1.0',
            873: '194.67.10.0',
            1222: '194.67.80.0',
            1186: '194.67.70.0',
            879: '194.67.40.0',
            880: '194.67.45.0',
            1223: '194.67.90.0',
            876: '194.67.25.0',
            872: '194.67.1.0',
            881: '194.60.25.0',
            877: '194.60.20.0',
            1138: '194.60.15.0',
            1181: '194.60.10.0',
            1212: '194.60.1.0',
            804: '194.67.80.30',
            805: '194.63.1.20',
            1188: '194.67.80.40',
            799: '194.31.5.0',
            800: '194.31.10.0',
            798: '194.31.1.0',
            791: '194.16.0.0',
            1044: '194.13.0.0',
            1045: '194.17.0.0',
            774: '194.14.30.0',
            765: '194.14.0.0',
            761: '194.12.1.0',
            777: '194.15.0.0'
        }
        let cristinResultThisYear = [];
        let currentRequestThisYear = 0;
        let cristinResultLastYear = [];
        let currentRequestLastYear = 0;
        let feilmelding = false;
        // sjekker om det er en NTNU-enhet som faktisk har Cristin-resultater
        if (unitVerdier[urlPARAM] === undefined) {

            var feil = document.createElement('div');
            var melding = document.createElement('div');
            melding.setAttribute('style', 'text-align :center;');
            melding.textContent = 'Ingen Cristinresultater for denne enheten';
            feil.appendChild(melding);
            oControlHost.container.appendChild(feil);
            feilmelding = true;
        } else {

            var section = document.createElement('div');
            var categories = ["ARTICLE", "MONOGRAPHACA", "CHAPTERACADEMIC"];
            var unit = unitVerdier[urlPARAM];

            categories.forEach(function (category) {
                var paramsString = "?fields=all&category=" + category + "&unit=" + unit + "&created_since=2019-01-01&created_before=" + today + '&per_page=999';
                var requestURL = "https://api.cristin.no/v2/results" + paramsString;
                var requestThisYear = new XMLHttpRequest();

                requestThisYear.open("GET", requestURL);
                requestThisYear.responseType = "json";
                requestThisYear.onload = function () {
                    //sjekker om nettleseren er Internet Explorer
                    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                    if (isIE) {
                        cristinResultThisYear = cristinResultThisYear.concat(jQuery.parseJSON(requestThisYear.response));
                    } else {
                        cristinResultThisYear = cristinResultThisYear.concat(requestThisYear.response);
                    }
                    currentRequestThisYear++;
                }

                requestThisYear.send();
            });

            categories.forEach(function (category) {
                var paramsString = "?fields=all&category=" + category + "&unit=" + unit + "&created_since=2018-01-01&created_before=" + lastYearDate + '&per_page=999';
                var requestURL = "https://api.cristin.no/v2/results" + paramsString;
                var requestLastYear = new XMLHttpRequest();

                requestLastYear.open("GET", requestURL);
                requestLastYear.responseType = "json";
                requestLastYear.onload = function () {
                    //sjekker om nettleseren er Internet Explorer
                    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                    if (isIE) {
                        cristinResultLastYear = cristinResultLastYear.concat(jQuery.parseJSON(requestLastYear.response));
                    } else {
                        cristinResultLastYear = cristinResultLastYear.concat(requestLastYear.response);
                    }
                    currentRequestLastYear++;
                }

                requestLastYear.send();
            });
        }
        if(!feilmelding) {
            let doneThisYear = false;
            let doneLastYear = false;
            setInterval(function () {
                if (currentRequestThisYear === categories.length && !doneThisYear) {
                    doneThisYear = true;
                    var resultNumThisYear = cristinResultThisYear.length;
                    resultNumThisYear = document.createElement('div');
                    resultNumThisYear.setAttribute('style', 'text-align :center; color :#6895C0; font-size: 48pt; font-weight: bold;');
                    resultNumThisYear.textContent = cristinResultThisYear.length;
                    section.appendChild(resultNumThisYear);
                    var resultTextThisYear = document.createElement('div');
                    resultTextThisYear.setAttribute('style', 'text-align :center');
                    resultTextThisYear.textContent = "Antall publikasjoner så langt i år";
                    section.appendChild(resultTextThisYear);
                    oControlHost.container.appendChild(section);
                }
            }, 500);
    
            setInterval(function () {
                if (currentRequestLastYear === categories.length && !doneLastYear) {
                    doneLastYear = true;
                    var resultSumLastYear = document.createElement('div');
                    resultSumLastYear.setAttribute('style', 'text-align :center;');
                    resultSumLastYear.textContent = "Antall publikasjoner på denne tiden i fjor: " + cristinResultLastYear.length;
                    section.appendChild(resultSumLastYear);
                    oControlHost.container.appendChild(section);
                }
            }, 1000);
        }
    }

    //Returnerer objektet
    return DataCristin;

});