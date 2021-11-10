<template>
<div id="app" class="">
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" data-bs-keyboard="false" data-bs-backdrop="false" aria-labelledby="offcanvasExampleLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">Configuration</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div id="sidebar" class="border rounded">
                <!-- <h1 class="">Configuration</h1> -->
                <!-- Path to csv -->
                <div class="p-2" id="enter-input-file-block">
                    <p>{{localisationConfigMenuEnterPathToCSV}} <input class="w-100" ref="sourceURL" id="sourceURL" type="text" value="https://docs.google.com/spreadsheets/d/e/2PACX-1vSbyepAqMIKF5b1mirtGDe7dbT0SP319as6X4AWEpNk74dzMgj1gZ3cUXUQDSDTj5zrrRCb-4ao1XgH/pub?gid=0&single=true&output=csv" onfocus="this.value=''"></p>
                </div>
            </div>
        </div>
    </div>

    <main class="">
        <div class="container ps-1 pe-1" style="max-width: 40em;">
            <div class="row align-items-start">
                <div class="col">
                    <div class="p-1">
                        <div class="justify-content-md-end sticky-top">
                            <template v-if="configMenuActive ==='true'">
                                <button class="btn btn-outline-dark float-end" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                                    </svg> menu
                                </button>
                            </template>

                            <template v-if="homeURL !==''">
                                <a id="menu-home" :href="homeURL">{{homeText}}</a>
                            </template>
                        </div>

                        <h1 class="ps-3 pe-3 pt-5">{{ introductionTitle }}</h1>
                        <!-- https://github.com/miaolz123/vue-markdown/issues/43 : -->
                        <p class="ps-3 pe-3">{{localeDataSourceLinkTo}} <a target="_blank" rel="noopener" :href="dataSource">{{localeDataSourceTheFile}}</a></p>
                        <vue-markdown class="ps-3 pe-3" :source='introductionText'></vue-markdown>

                        <div id="timeKnotsContainer" style="position: relative; ">
                            <div :class="item.nodeType" :id="'item' + item.counter" v-bind:style="'top: ' + item.top + 'px;padding: 0;'" v-for="item in timeLineData" v-bind:key="item.counter">
                                <span :class="item.extraClass" v-if="item.nodeType === 'timeLineEvent'" v-bind:style="'background-color: ' + randomBackgroundColor()" style="display: block;" class="clearfix main-info p-1 ps-3 pe-3">
                                    <button v-if="item.counter > 0" class="timeLineEventNavPrev2 btn btn-outline-secondary btn-sm border-0 float-end" @click="goToTimeLineEvent(item.counter,$event)">▲</button>

                                    <span v-if="item.counter>-0" class="timeDifference timeDifferenceWithLastEvent text-center mb-3">
                                        {{item.timeDifferenceWithLastEvent}} {{localeTextAppend1}} (<time>{{ item.dateLong }} </time>)
                                    </span>
                                    <span v-else class="timeDifference timeDifferenceWithLastEvent text-center mb-3">
                                        <time>{{ item.dateLong }} </time>
                                    </span>

                                    <span class="timeLineEventNav ">
                                        <button v-if="item.counter > 0" class="timeLineEventNavPrev btn btn-lg btn-outline-dark mb-2 " @click="goToTimeLineEvent(item.counter,$event)">▲</button>
                                        <button v-if="item.counter < timeLineData.length - 2" class="timeLineEventNavNext btn btn-lg btn-outline-dark" @click="goToTimeLineEvent(item.counter,$event)">▼</button>
                                        <div v-if="item.counter === 0" class="animated-arrow"></div>
                                    </span>

                                    <h2 class="text-center">
                                        {{ item.Headline }}
                                        <!-- Collapse button -->
                                        <!-- <template v-if="item.Text!==''">
                                            <a style="position: absolute; top: 0.2em; right: 0.2em;" class="btn btn-outline-secondary btn-sm ms-2" data-bs-toggle="collapse" :href="'#timeLineEvent' + item.counter" role="button" aria-expanded="false" :aria-controls="'timeLineEvent' + item.counter">-</a>
                                        </template> -->
                                    </h2>
                                    <!-- Collapse button -->
                                    <div class="collapse show" :id="'timeLineEvent' + item.counter">
                                        <vue-markdown>{{ item.Text }}</vue-markdown>
                                    </div>

                                    <button class="timeLineEventNavNext2 btn btn-outline-secondary btn-sm border-0 float-end" @click="goToTimeLineEvent(item.counter,$event)">▼</button>
                                </span>
                                <template v-else>
                                    <time>{{ item.dateLong }}, {{ item.timeDifferenceWithFirstEvent }} {{localeTextAppend2 }}</time>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer mt-auto py-3 bg-light small border-top" style="position: fixed; bottom: 0; left: 0; z-index: 3;width: 100%;padding: 0.5em !important;">
        <div class="container">
            <!-- Scale -->
            <div class="row justify-content-center">
                <div class="col text-center clearfix">
                    <div class="primary button-group d-inline border-end pe-2">
                        <input class="button me-1" type="button" value="A –" id="minus">
                        <input class="button" type="button" value="A +" id="plus">
                    </div>
                    <div class="primary button-group d-inline">
                        <input class="button" type="button" value="scale –" id="scale-minus">
                        <span id="scaleRangeInfo" class="ms-2 me-2"></span>
                        <input class="button" type="button" value="scale +" id="scale-plus">
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div>
</template>

<script>
import publicPath from "../vue.config";
import * as d3 from "d3";

import {
    format,
    formatDistance,
    add,
    getUnixTime,
    differenceInMilliseconds
} from 'date-fns';
import {
    nl,
    en
} from 'date-fns/locale';
import {
    TimeKnots
} from '@/assets/js/timeknots.js';
import VueMarkdown from 'vue-markdown';

import {
    localisation
} from '../localisation';

let loc;
switch (localisation.locale) {
    case "en":
        loc = en;
        break;
    case "nl":
        loc = nl;
        break;
}

export default {
    name: "App",
    components: {
        VueMarkdown
    },
    data: function () {
        return {
            inputSourceURL: null,
            homeURL: process.env.VUE_APP_HOME_URL,
            homeText: process.env.VUE_APP_HOME_TEXT,
            configMenuActive: process.env.VUE_APP_CONFIG_MENU_ACTIVE,
            dataSource: "",
            introduction: [],
            introductionTitle: "",
            introductionText: "",
            myData: 0,
            timeLineData: [],
            blockColours: [
                "#dcdcdc", "#d3d3d3", "#e5e4e2", "#dcdcdc", "#dbd7d2", "#d3d3d3"
            ],
            localeTextAppend1: localisation.textAppend1,
            localeTextAppend2: localisation.textAppend2,
            localisationConfigMenuEnterPathToCSV: localisation.configMenu.enterPathToCSV,
            localeDataSourceLinkTo: localisation.dataSource.linkTo,
            localeDataSourceTheFile: localisation.dataSource.theFile
        }
    },
    mounted() {
        this.main();
        this.fontSize();
        this.randomBackgroundColor();

        this.$nextTick(function () {
            this.inputSourceURL = this.$refs.sourceURL;
            this.getDataSource();
        });
    },
    methods: {
        getDataSource() {
            if (process.env.VUE_APP_DATA_SOURCE !== "") {
                this.dataSource = process.env.VUE_APP_DATA_SOURCE;
            } else {
                this.dataSource = this.inputSourceURL.value;
            }
        },
        goToTimeLineEvent(i, event) {
            if (event.target.classList.contains("timeLineEventNavNext") || event.target.classList.contains("timeLineEventNavNext2")) {
                i++
            } else {
                i--
            }
            let item = document.querySelector("#item" + i);
            document.querySelectorAll(".timeLineEventNavPrev, .timeLineEventNavNext").forEach(function (item) {
                item.classList.remove("visible")
            });
            document.querySelectorAll("#item" + i + " button").forEach(function (item) {
                item.classList.add("visible")
            });
            item.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        },

        // randomizer
        randomFromTo(from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        },
        randomBackgroundColor() {
            // give timeLineEvents a random color
            return this.blockColours[this.randomFromTo(0, this.blockColours.length - 1)];
        },
        // https://www.codegrepper.com/code-examples/javascript/javascript+add+leading+zero+if+1+number+only
        padLeadingZeros(num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        },
        fillEmptyDates(d) {
            if (d === "") {
                d = "1"
            }
            return d;
        },
        fontSize() {
            function getFontSize() { //https://stackoverflow.com/a/15195345
                var style = window.getComputedStyle(body, null).getPropertyValue('font-size');
                fontSize = parseFloat(style);
            }

            function plus() {
                getFontSize();
                body.style.fontSize = (fontSize + 1) + 'px';
            }

            function minus() {
                getFontSize();
                body.style.fontSize = (fontSize - 1) + 'px';
            }

            var body = document.querySelector("body");
            var buttonMinus = document.querySelector("#minus");
            var buttonPlus = document.querySelector("#plus");
            var fontSize;

            buttonPlus.addEventListener("click", plus, false);
            buttonMinus.addEventListener("click", minus, false);
        },
        main() {
            let lang = "nl";
            let that = this;
            let formatDateLong = "d MMMM yyyy"; // date-fns
            // let formatDateLong = "E dd MMM"; // date-fns
            let formatDateShort = "LL";
            let timeLineEventOffsetX = 50;
            let timeLineEventOffsetY = -15;
            let timeAxisOffsetX = 10;
            let timeAxisOffsetY = -12;
            let timeKnotsContainerHeight = process.env.VUE_APP_SCALE;
            let timeKnotsContainerWidth = 44;
            let timeKnotsTextColor = "#4c4e4d";
            let timeKnotsBackgroundColor = "#b6b8b7";
            let timeKnotsWidth = 50;
            let timeKnotsHorizontalLayout = false;
            let timeKnotsShowLabels = false;
            let timeKnotsLabelFormat = "%H:%M";
            let timeKnotsRadius = 10;
            let timeKnotsLineWidth = 2;
            let firstDate;
            let lastDate;
            let sourceURL;
            let scaleRangeInfo = document.querySelector("#scaleRangeInfo");
            let inputSourceURL = document.querySelector("#sourceURL");
            let enterInputFileBlock = document.querySelector("#enter-input-file-block");

            function fetchData(d) {
                d3.csv(d, function (data) {
                    processData(data);
                });
            }

            // listen to input for csv source
            // https://stackoverflow.com/a/26946264
            inputSourceURL.addEventListener('input', function (evt) {
                // set the url to the given url
                location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + "?source=" + encodeURIComponent(this.value) + "&scale=";

                fetchData(this.value);
            });

            const parsedUrl = new URL(window.location.href);
            const strAllQueryParameters = window.location.search;
            const allQueryParameters = new URLSearchParams(strAllQueryParameters);

            // Where to load data from:
            // If .env has a url then use it:
            if (process.env.VUE_APP_DATA_SOURCE !== "") {
                // the input should not be functional
                enterInputFileBlock.style.display = "none";
                enterInputFileBlock.disabled = true;

                // load data from url
                sourceURL = process.env.VUE_APP_DATA_SOURCE;

                // allQueryParameters.toString()
                allQueryParameters.delete('source');
                window.history.pushState('', '', window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + allQueryParameters.toString());
            }
            // read value from url if there is a url to csv in the url:
            else if (parsedUrl.searchParams.get("source") !== null) {
                sourceURL = parsedUrl.searchParams.get("source");

                document.querySelector("#sourceURL").value = document.querySelector("#sourceURL").value = sourceURL;
            }
            // read value from input if there is NOT a url to csv in the url
            else {
                sourceURL = document.querySelector("#sourceURL").value;
            }

            // Load data
            fetchData(sourceURL);

            // // d3 version 7
            // d3.csv(dataSource).then(function (data) {
            //     processData(data, timeKnotsContainerHeight);
            // })

            function processData(myData) {
                function setScale() {
                    // SET timeKnotsContainerHeight
                    // 1: if scale parameter in url exists and has value
                    if (allQueryParameters.get('scale') !== "" && allQueryParameters.get('scale') !== null) {
                        timeKnotsContainerHeight = parseInt(allQueryParameters.get('scale'), 10);
                    }
                    // 2: if VUE_APP_PATH in .env has no value
                    else if (timeKnotsContainerHeight === "") {
                        timeKnotsContainerHeight = differenceInMilliseconds(new Date(lastDate), new Date(firstDate)) / 40000000;
                    }
                    // 3: if 1 and 2 do not apply use value that was set at declaration (VUE_APP_PATH in .env)

                    scale();

                    function scale() {
                        allQueryParameters.delete('scale');
                        allQueryParameters.set('scale', parseInt(timeKnotsContainerHeight), 10);
                        // Replace current querystring with the new one, https://getbutterfly.com/how-to-get-and-set-query-parameters-from-url/                        
                        window.history.pushState('', '', window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + allQueryParameters.toString());

                        scaleRangeInfo.innerHTML = parseInt(timeKnotsContainerHeight, 10);
                        draw(timeKnotsContainerHeight);
                    }

                    function scalePlus() {
                        timeKnotsContainerHeight = +timeKnotsContainerHeight + (timeKnotsContainerHeight / 10);
                        scale();
                    }

                    function scaleMinus() {
                        timeKnotsContainerHeight = +timeKnotsContainerHeight - (timeKnotsContainerHeight / 10);
                        scale();
                    }

                    var buttonScaleMinus = document.querySelector("#scale-minus");
                    var buttonScalePlus = document.querySelector("#scale-plus");

                    buttonScalePlus.addEventListener("click", scalePlus, false);
                    buttonScaleMinus.addEventListener("click", scaleMinus, false);
                }

                function fixTimeLineData(d) {
                    // fillEmptyDates(that.timeLineData[i]);
                    d.Day = that.fillEmptyDates(d.Day);
                    d.Month = that.fillEmptyDates(d.Month);

                    // turn “1” into “01” etc
                    d.Month = that.padLeadingZeros(d.Month, 2);
                    d.Day = that.padLeadingZeros(d.Day, 2);
                    d.Time = "00:00:00";
                    d.top = 0;

                    // construct final date
                    d.date = d.Year + "-" + d.Month + "-" + d.Day + "T" + d.Time;

                    // add variants of the time stamp that are more readable
                    // regex: https://stackoverflow.com/a/5646753
                    d.dateLong = format(new Date(d.date), formatDateLong, {
                        locale: loc
                    });
                    d.dateShort = format(new Date(d.date), formatDateShort);
                }

                function addTimeDifferences(d, e, firstDate) {
                    d.timeDifferenceWithFirstEvent = formatDistance(new Date(d.date), new Date(firstDate), {
                        locale: loc
                    });

                    d.timeDifferenceWithLastEvent = formatDistance(new Date(d.date), new Date(e.date), {
                        locale: loc
                    });
                }

                // clone myData ES6 way
                that.timeLineData = [...myData];

                // if loading via d3 then a ' is added to first column header by d3. This should be removed
                // https://stackoverflow.com/a/14592469
                if ("'Year" in that.timeLineData[0]) {
                    for (let i = 0; i < that.timeLineData.length; i++) {
                        Object.defineProperty(that.timeLineData[i], "Year",
                            Object.getOwnPropertyDescriptor(that.timeLineData[i], "'Year"));
                        delete that.timeLineData[i]["'Year"];
                    }
                }

                // First row is used for introduction. The rest is used for the timeline. Shift removes AND returns the first item
                that.introduction = that.timeLineData.shift();
                that.introductionTitle = that.introduction["Headline"];
                that.introductionText = that.introduction["Text"];

                // These are all the events for the timeline
                that.timeLineData.forEach(element => {
                    element.nodeType = "timeLineEvent";
                })

                if (process.env.VUE_APP_SHOW_TODAY === "true") {
                    // add indication for 'today' at the end of array. Sorting will take care of this
                    that.timeLineData.push({
                        "Year": format(new Date(), "yyyy"),
                        "Month": format(new Date(), "MM"),
                        "Day": format(new Date(), "dd"),
                        "Time": "00:00:00",
                        "Headline": localisation.today,
                        "Text": "",
                        "nodeType": "timeLineEvent",
                        "extraClass": "today"
                    })
                }

                for (let i = 0; i < that.timeLineData.length; i++) {
                    fixTimeLineData(that.timeLineData[i]);
                }

                // sorting based on unix time, so the order in the cvs is not important anymore
                that.timeLineData.sort(function (a, b) {
                    return (getUnixTime(new Date(a.date)) > getUnixTime(new Date(b.date))) ? 1 : ((getUnixTime(new Date(b.date)) > getUnixTime(new Date(a.date))) ? -1 : 0);
                });

                firstDate = that.timeLineData[0].date;
                lastDate = that.timeLineData[that.timeLineData.length - 1].date;
                // differenceInMilliseconds(firstDate,lastDate)

                let i = 1;

                (function createTimeAxis() {
                    that.timeLineData.push({
                        // add i months to beginning of timeline
                        Year: format(add(new Date(firstDate), {
                            months: i
                        }), "yyyy"),
                        Month: format(add(new Date(firstDate), {
                            months: i
                        }), "MM"),
                        Day: "01",
                        Time: "00:00:00",
                        Text: "",
                        Headline: "",
                        nodeType: "timeAxis",
                        top: 0
                    });
                    i++;
                    // fix the last item, that was just added
                    fixTimeLineData(that.timeLineData[that.timeLineData.length - 1]);

                    // only proceed if the date is before the last event date
                    if (getUnixTime(new Date(that.timeLineData[that.timeLineData.length - 1].date)) < (getUnixTime(new Date(lastDate)) + getUnixTime(new Date(lastDate)) / 100)) {
                        createTimeAxis();
                    }
                }());

                addTimeDifferences(that.timeLineData[0], that.timeLineData[0], firstDate);
                for (let i = 1; i < that.timeLineData.length; i++) {
                    addTimeDifferences(that.timeLineData[i], that.timeLineData[i - 1], firstDate);
                }

                // add unique key named “counter”
                for (let i = 0; i < that.timeLineData.length; i++) {
                    that.timeLineData[i].counter = i;
                }

                setScale();

                // draw the circles and vertical line (SVG)
                draw(timeKnotsContainerHeight);
            }

            function draw(timeKnotsContainerHeight) {
                let svg = document.querySelector("#timeKnotsContainer svg");
                if (svg) {
                    svg.remove();
                }

                TimeKnots.draw("#timeKnotsContainer", that.timeLineData, {
                    width: timeKnotsWidth,
                    height: timeKnotsContainerHeight,
                    horizontalLayout: timeKnotsHorizontalLayout,
                    color: timeKnotsTextColor,
                    background: timeKnotsBackgroundColor,
                    containerWidt: timeKnotsContainerWidth,
                    showLabels: timeKnotsShowLabels,
                    labelFormat: timeKnotsLabelFormat,
                    radius: timeKnotsRadius,
                    lineWidth: timeKnotsLineWidth
                });

                function drawContent(timeLineData) {
                    let allCircles = document.querySelectorAll("circle");
                    for (let i = 0; i < allCircles.length; i++) {
                        if (timeLineData[i].nodeType === "timeAxis") {
                            // make timeAxis circles smaller
                            allCircles[i].setAttribute("r", "5");

                            // set top positions
                            timeLineData[i]["top"] = Number(allCircles[i].getAttribute("cy")) + timeAxisOffsetY;
                        }
                        if (timeLineData[i].nodeType === "timeLineEvent") {
                            // set top positions
                            timeLineData[i]["top"] = Number(allCircles[i].getAttribute("cy")) + timeLineEventOffsetY;
                        }
                    }
                }

                drawContent(that.timeLineData);
            }

            function focus(e) {
                let allTimeLineEvents = document.querySelectorAll(".timeLineEvent");

                if (e.target && e.target.matches(".timeLineEvent *")) {
                    for (let i = 0; i < allTimeLineEvents.length; i++) {
                        allTimeLineEvents[i].classList.remove("timeLineEventActive");
                    }
                    e.target.closest("div.timeLineEvent").classList.add("timeLineEventActive");
                }
            }

            function focus2(e) {
                let allTimeLineEvents = document.querySelectorAll(".timeLineEvent");

                function removeAll() {
                    for (let i = 0; i < allTimeLineEvents.length; i++) {
                        allTimeLineEvents[i].classList.remove("timeLineEventActive");
                    }
                }

                if (e.target && e.target.matches("button.timeLineEventNavPrev") || e.target && e.target.matches("button.timeLineEventNavPrev2")) {
                    removeAll();
                    e.target.closest("div.timeLineEvent").previousSibling.classList.add("timeLineEventActive");
                }
                if (e.target && e.target.matches("button.timeLineEventNavNext") || e.target && e.target.matches("button.timeLineEventNavNext2")) {
                    removeAll();
                    e.target.closest("div.timeLineEvent").nextSibling.classList.add("timeLineEventActive");
                }
            }

            document.querySelector("body").addEventListener("mouseover", focus, false);
            document.querySelector("body").addEventListener("touchend", focus, true);
            document.querySelector("body").addEventListener("click", focus2, true);

            // document.addEventListener("focus", function () {
            // GA Google Analytics, track XMLHttpRequest
            //http://stackoverflow.com/a/15011353
            // if (typeof (_gaq) !== "undefined") {
            //   _gaq.push(["_trackPageview", window.location.pathname + window.location.hash + "-focus"]);
            // }
            // }, false);

        }
    }
};
</script>

<style lang="scss">
/*! Generated by Font Squirrel (https://www.fontsquirrel.com) on October 9, 2020 */
@font-face {
    font-family: 'poppinsbold';
    src: url('./assets/fonts/poppins/bold/poppins-bold-webfont.woff2') format('woff2'),
        url('./assets/fonts/poppins/bold/poppins-bold-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

/*! Generated by Font Squirrel (https://www.fontsquirrel.com) on October 9, 2020 */
@font-face {
    font-family: 'poppinsmedium';
    src: url('./assets/fonts/poppins/medium/poppins-medium-webfont.woff2') format('woff2'),
        url('./assets/fonts/poppins/medium/poppins-medium-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

/*! Generated by Font Squirrel (https://www.fontsquirrel.com) on October 9, 2020 */
@font-face {
    font-family: 'poppinsregular';
    src: url('./assets/fonts/poppins/regular/poppins-regular-webfont.woff2') format('woff2'),
        url('./assets/fonts/poppins/regular/poppins-regular-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

$offsetTimeLineEvent: 45px;

body {
    background-color: #3c6382 !important;
    font-family: poppinsregular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

h1,
h2,
h3,
h4,
h5,
h6 {
    text-transform: uppercase;
    font-family: poppinsregular;
}

.container {
    background: rgb(248, 244, 244);
}

#timeKnotsContainer {
    margin-bottom: 2em;
}

.timeLineEvent,
.timeAxis {
    position: absolute;
    left: $offsetTimeLineEvent;
}

// .timeLineEvent:last-of-type {
//     margin-bottom: 200em;
// }
.timeLineEvent {
    opacity: 1;
    background: #f8f8f4;
    color: #0c2461;
    outline: 1px solid #b3b1af;
    padding: 1em 1em 2em;
    transition: 0.3s ease-in-out;
    transition-property: outline background;
    transition-delay: 0ms;
    min-width: 10em;

    z-index: 1;
    box-shadow:
        2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
        6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
        12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
        22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
        41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
        100px 100px 80px rgba(0, 0, 0, 0.07);
    width: calc(100% - #{$offsetTimeLineEvent} - 60px);
    z-index: 1;
}

/* after touch / mouseover */
.timeLineEventActive {
    z-index: 2;
}

.timeLineEventActive>span.main-info {
    opacity: 1;
    outline: 1px solid #4B4E4D;
    transition: 0.3s ease-in-out;
    transition-property: outline background;
    transition-delay: 0ms;
    background: #fad390 !important;
}

.today {
    background: #6a89cc !important;
    padding: 0;
}

.today .timeDifferenceContainer {
    display: none;
}

.today h2 {
    text-align: center;
    font-size: 3em !important;
}

.timeDifference {
    display: block;
    padding: 0.1em;
    font-size: 0.8em;
}

.timeLineEvent time {
    // display: block;
    margin: 0.3em 0 0 0;
    // font-size: 0.7em;
    font-style: italic;
}

.timeLineEvent h2 {
    font-size: 1em;
}

.timeLineEvent>span:before {
    content: "◯";
    font-size: 24px;
    color: transparent;
    position: absolute;
    top: 13px;
    left: calc(0px - $offsetTimeLineEvent + 15px);
    line-height: 3px;
    width: calc(0px - $offsetTimeLineEvent + 74px);
    cursor: pointer;
    background: #4b4e4d6b;
    height: 5px;
    vertical-align: text-bottom;
}

.timeLineEventActive>span:before {
    background: #4B4E4D;
}

.timeLineEventNav {
    display: block;
    position: absolute;
    right: -4em;
    top: 50%;
    transform: translateY(-50%);
    z-index: 4;
}

.timeLineEventNav button {
    display: none;
}

#item0 button:first-of-type,
.timeLineEventNav button.visible {
    display: block;
}

#item0 button.timeLineEventNavNext2:first-of-type {
    display: none;
}

.timeAxis {
    font-size: 0.8em;
    z-index: 0;
}

// https://codepen.io/humajono/pen/lBnfc, adapted
.animated-arrow {
    position: absolute;
    top: -170%;
    left: 50%;
    margin-left: 0px;
    animation: arrow-bounce 3s both infinite;
}

.animated-arrow:before,
.animated-arrow:after {
    content: '';
    position: absolute;
    top: 0;
    right: -24px;
    width: 30px;
    height: 7px;
    border-radius: 10px;
    display: block;
    background: #111;
    transform: rotate(-45deg);
}

.animated-arrow:after {
    right: inherit;
    left: -24px;
    transform: rotate(45deg);
}

@keyframes arrow-bounce {
    0% {
        transform: translateY(0);
        opacity: 0;
    }

    60% {
        opacity: 1;
    }

    100% {
        transform: translateY(60px);
        opacity: 0
    }
}

video,
.timeLineEvent img {
    display: block;
    border: 1px solid #ef8800;
    max-width: 100%;
    margin: 1em auto;
}

/* BEGIN PULS */
.animatedSlow {
    animation-duration: 2s;
    animation-fill-mode: both;
    animation-iteration-count: 3;
}

.animatedSlow.infinite {
    animation-iteration-count: infinite;
}

@keyframes pulse {
    from {
        transform: scale3d(1, 1, 1);
    }

    50% {
        transform: scale3d(1.15, 1.15, 1.15);
    }

    to {
        transform: scale3d(1, 1, 1);
    }
}

.pulse {
    animation-name: pulse;
}

/* EIND PULS */
</style>
