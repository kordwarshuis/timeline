<template>
<div id="app" class="">
    <main class="">
        <div class="container ps-5 pe-5" style="max-width: 40em;">
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
                                <a :href="homeURL">{{homeText}}</a>
                            </template>
                        </div>

                        <h1 class="">{{ introductionTitle }}</h1>
                        <p class="subheader">{{ introductionText }}</p>
                        <!-- <div>
                            <vue-markdown>{{ introductionText }}</vue-markdown>
                        </div> -->

                        <div id="timeKnotsContainer" style="position: relative; ">

                            <div :class="item.nodeType" :id="'item' + item.counter" v-bind:style="'position: absolute;  left: ' + item.left + 'px; top: ' + item.top + 'px;padding: 0;'" v-for="item in timeLineData" v-bind:key="item.counter">

                                <span v-if="item.nodeType === 'timeLineEvent'" v-bind:style="'background-color: ' + randomBackgroundColor()" style="display: block;" class="p-3">

                                    <time>{{ item.dateLong }} </time>

                                    <!-- <span class='timeDifference'>({{item.timeDifference}} later)</span> -->

                                    <h2 class="">
                                        <vue-markdown>{{ item.Headline }}</vue-markdown>
                                        <!-- Collapse button -->
                                        <template v-if="item.Text!==''">
                                            <a style="position: absolute; top: 0.2em; right: 0.2em;" class="btn btn-outline-secondary btn-sm ms-2" data-bs-toggle="collapse" :href="'#timeLineEvent' + item.counter" role="button" aria-expanded="false" :aria-controls="'timeLineEvent' + item.counter">-</a>
                                        </template>
                                    </h2>
                                    <!-- Collapse button -->
                                    <div class="collapse show" :id="'timeLineEvent' + item.counter">
                                        <vue-markdown>{{ item.Text }}</vue-markdown>
                                    </div>

                                </span>
                                <template v-else>
                                    <time>{{ item.dateLong }} </time>

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
            <div class="row">
                <div class="col ">
                    <div class="primary button-group float-start border-end pe-2">
                        <input class="button me-1" type="button" value="A –" id="minus">
                        <input class="button" type="button" value="A +" id="plus">
                    </div>

                    <div class="primary button-group float-start ps-2">
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
    nl
} from 'date-fns/locale';
import {
    TimeKnots
} from '@/assets/js/timeknots.js';
import VueMarkdown from 'vue-markdown';

export default {
    name: "App",
    components: {
        VueMarkdown
    },
    data: function () {
        return {
            homeURL: process.env.VUE_APP_HOME_URL,
            homeText: process.env.VUE_APP_HOME_TEXT,
            configMenuActive: process.env.VUE_APP_CONFIG_MENU_ACTIVE,
            introduction: [],
            introductionTitle: "",
            introductionText: "",
            myData: 0,
            timeLineData: [],
            blockColours: [
                "#dcdcdc", "#d3d3d3", "#e5e4e2", "#dcdcdc", "#dbd7d2", "#d3d3d3"
            ]
        }
    },
    mounted() {
        this.main();
        this.fontSize();
        this.randomBackgroundColor();
    },
    methods: {
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

                    d.left = 0; //if not created here, the view will not be updated on changes, https://vuejs.org/v2/guide/reactivity.html#For-Arrays
                    d.top = 0;

                    // construct final date
                    d.date = d.Year + "-" + d.Month + "-" + d.Day + "T" + d.Time;

                    // add variants of the time stamp that are more readable
                    // regex: https://stackoverflow.com/a/5646753
                    d.dateLong = format(new Date(d.date), formatDateLong, {
                        locale: nl
                    });
                    d.dateShort = format(new Date(d.date), formatDateShort);

                    // d.timeDifference = formatDistance(new Date(d.date),new Date(firstDate),{locale: nl});
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

                for (let i = 0; i < that.timeLineData.length; i++) {
                    fixTimeLineData(that.timeLineData[i]);
                }

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
                        left: 0,
                        top: 0
                    });
                    i++;
                    // fix the last item, that was just added
                    fixTimeLineData(that.timeLineData[that.timeLineData.length - 1]);

                    // only proceed if the date is before the last event date
                    if (getUnixTime(new Date(that.timeLineData[that.timeLineData.length - 1].date)) < getUnixTime(new Date(lastDate))) {
                        createTimeAxis();
                    }
                }());

                // add unique key named “counter”
                for (let i = 0; i < that.timeLineData.length; i++) {
                    that.timeLineData[i].counter = i;
                }

                setScale();

                // draw the circles and vertical line (SVG)
                draw(timeKnotsContainerHeight);
            }

            function draw(timeKnotsContainerHeight) {
                if (document.querySelector("#timeKnotsContainer svg")) {
                    document.querySelector("#timeKnotsContainer svg").remove();
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

                            // set left and top positions
                            timeLineData[i]["left"] = Number(allCircles[i].getAttribute("cx")) + timeAxisOffsetX;
                            timeLineData[i]["top"] = Number(allCircles[i].getAttribute("cy")) + timeAxisOffsetY;
                        }
                        if (timeLineData[i].nodeType === "timeLineEvent") {
                            // set left and top positions
                            timeLineData[i]["left"] = Number(allCircles[i].getAttribute("cx")) + timeLineEventOffsetX;
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
                    document.dispatchEvent(focusEvent);
                }
            }
            let focusEvent = new CustomEvent("focus");
            // https://davidwalsh.name/event-delegate
            document.querySelector("body").addEventListener("mouseover", focus, false);
            document.querySelector("body").addEventListener("touchend", focus, true);

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
body {
    background-color: #35465C !important;
}

.container {
    background: rgb(248, 244, 244);
}

#timeKnotsContainer {
    padding-bottom: 20em;
}

.timeLineEvent {
    opacity: 0.9;
    background: #f8f8f4;
    color: #0c2461;
    outline: 1px solid #b3b1af;
    padding: 1em 1em 2em;
    transition: 0.1s ease-in-out;
    transition-property: outline;
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

    // min-width: 100%;
}

/* after touch / mouseover */
.timeLineEventActive {
    z-index: 2;
}

.timeLineEventActive span {
    opacity: 1;
    outline: 5px solid #4B4E4D;
    transition: 0.1s ease-in-out;
    transition-property: outline;
    transition-delay: 150ms;
    background: #f5f2a0 !important;
    // background: #ffffff !important;
}

.timeLineEvent time {
    margin: 0.3em 0 0 0;
    font-size: 0.7em;
    font-style: italic;
}

.timeLineEvent h2 {
    // margin-left: 0.5em;
    // margin-top: 0em;
    font-size: 1em;
}

.timeLineEvent span:before {
    content: "◯";
    font-size: 24px;
    color: transparent;
    position: absolute;
    top: 13px;
    left: -61px;
    line-height: 3px;
    width: 58px;
    cursor: pointer;
    background: #4b4e4d6b;
    height: 5px;
    vertical-align: text-bottom;
}

.timeLineEventActive span:before {
    background: #4B4E4D;
}

.timeAxis {
    z-index: 0;
}

.timeAxis {
    font-size: 0.8em;
}

video,
.timeLineEvent img {
    display: block;
    border: 3px solid #ef8800;
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
