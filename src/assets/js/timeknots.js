import * as d3 from "d3";

// source: https://github.com/alangrafu/timeknots, modified
export var TimeKnots = {
    draw: function (id, events, options) {
        var timestamps;
        var maxValue;
        var minValue;
        var format;
        var startString;
        var endString;

        var cfg = {
            width: 600,
            height: 200,
            radius: 10,
            lineWidth: 4,
            color: "#999",
            background: "#FFF",
            dateFormat: "%Y/%m/%d %H:%M:%S",
            horizontalLayout: true,
            showLabels: false,
            labelFormat: "%Y/%m/%d %H:%M:%S",
            addNow: false,
            seriesColor: d3.scale.category20(),
            dateDimension: true
        };

        //default configuration overrid
        if (options !== undefined) {
            for (var i in options) {
                cfg[i] = options[i];
            }
        }
        if (cfg.addNow !== false) {
            events.push({
                date: new Date(),
                name: cfg.addNowLabel || "Today"
            });
        }
        var tip = d3.select(id)
            .append('div')
            .style("opacity", 0)
            .style("position", "absolute")
            .style("font-family", "Helvetica Neue")
            .style("font-weight", "300")
            .style("background", "rgba(0,0,0,0.5)")
            .style("color", "white")
            .style("padding", "5px 10px 5px 10px")
            .style("-moz-border-radius", "8px 8px")
            .style("border-radius", "8px 8px");
        var svg = d3.select(id).append('svg').attr("width", cfg.width).attr("height", cfg.height);
        //Calculate times in terms of timestamps
        if (!cfg.dateDimension) {
            timestamps = events.map(function (d) {
                return d.value;
            }); //new Date(d.date).getTime()});
            maxValue = d3.max(timestamps);
            minValue = d3.min(timestamps);
        } else {
            timestamps = events.map(function (d) {
                return Date.parse(d.date);
            }); //new Date(d.date).getTime()});
            maxValue = d3.max(timestamps);
            minValue = d3.min(timestamps);
        }
        var margin = (d3.max(events.map(function (d) {
            return d.radius;
        })) || cfg.radius) * 1.5 + cfg.lineWidth;
        var step = (cfg.horizontalLayout) ? ((cfg.width - 2 * margin) / (maxValue - minValue)) : ((cfg.height - 2 * margin) / (maxValue - minValue));
        var series = [];
        if (maxValue == minValue) {
            step = 0;
            if (cfg.horizontalLayout) {
                margin = cfg.width / 2;
            } else {
                margin = cfg.height / 2;
            }
        }

        var linePrevious = {
            x1: null,
            x2: null,
            y1: null,
            y2: null
        };

        svg.selectAll("line")
            .data(events).enter().append("line")
            .attr("class", "timeline-line")
            .attr("x1", function (d) {
                var ret;
                if (cfg.horizontalLayout) {
                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                    ret = Math.floor(step * (datum - minValue) + margin);
                } else {
                    ret = Math.floor(cfg.width / 2);
                }
                linePrevious.x1 = ret;
                return ret;
            })
            .attr("x2", function (d) {
                var ret;
                if (linePrevious.x1 != null) {
                    return linePrevious.x1;
                }
                if (cfg.horizontalLayout) {
                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                    ret = Math.floor(step * (datum - minValue));
                }
                return Math.floor(cfg.width / 2);
            })
            .attr("y1", function (d) {
                var ret;
                if (cfg.horizontalLayout) {
                    ret = Math.floor(cfg.height / 2);
                } else {
                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                    ret = Math.floor(step * (datum - minValue)) + margin;
                }
                linePrevious.y1 = ret;
                return ret;
            })
            .attr("y2", function (d) {
                if (linePrevious.y1 != null) {
                    return linePrevious.y1;
                }
                if (cfg.horizontalLayout) {
                    return Math.floor(cfg.height / 2);
                }
                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                return Math.floor(step * (datum - minValue));
            })
            .style("stroke", function (d) {
                if (d.color != undefined) {
                    return d.color;
                }
                if (d.series != undefined) {
                    if (series.indexOf(d.series) < 0) {
                        series.push(d.series);
                    }
                    return cfg.seriesColor(series.indexOf(d.series));
                }
                return cfg.color;
            })
            .style("stroke-width", cfg.lineWidth);

        svg.selectAll("circle")
            .data(events).enter()
            .append("circle")
            .attr("class", "timeline-event")
            .attr("r", function (d) {
                if (d.radius != undefined) {
                    return d.radius;
                }
                return cfg.radius;
            })
            .style("stroke", function (d) {
                if (d.color != undefined) {
                    return d.color;
                }
                if (d.series != undefined) {
                    if (series.indexOf(d.series) < 0) {
                        series.push(d.series);
                    }
                    return cfg.seriesColor(series.indexOf(d.series));
                }
                return cfg.color;
            })
            .style("stroke-width", function (d) {
                if (d.lineWidth != undefined) {
                    return d.lineWidth;
                }
                return cfg.lineWidth;
            })
            .style("fill", function (d) {
                if (d.background != undefined) {
                    return d.background;
                }
                return cfg.background;
            })
            .attr("cy", function (d) {
                if (cfg.horizontalLayout) {
                    return Math.floor(cfg.height / 2);
                }
                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                return Math.floor(step * (datum - minValue) + margin);
            })
            .attr("cx", function (d) {
                if (cfg.horizontalLayout) {
                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                    var x = Math.floor(step * (datum - minValue) + margin);
                    return x;
                }
                return Math.floor(cfg.width / 2);
            });

        //Adding start and end labels
        if (cfg.showLabels != false) {
            if (cfg.dateDimension) {
                format = d3.time.format(cfg.labelFormat);
                startString = format(new Date(minValue));
                endString = format(new Date(maxValue));
            } else {
                format = function (d) {
                    return d;
                }; //Should I do something else?
                startString = minValue;
                endString = maxValue;
            }
            svg.append("text")
                .text(startString).style("font-size", "70%")
                .attr("x", function (d) {
                    if (cfg.horizontalLayout) {
                        return d3.max([0, (margin - this.getBBox().width / 2)]);
                    }
                    return Math.floor(this.getBBox().width / 2);
                })
                .attr("y", function (d) {
                    if (cfg.horizontalLayout) {
                        return Math.floor(cfg.height / 2 + (margin + this.getBBox().height));
                    }
                    return margin + this.getBBox().height / 2;
                });

            svg.append("text")
                .text(endString).style("font-size", "70%")
                .attr("x", function (d) {
                    if (cfg.horizontalLayout) {
                        return cfg.width - d3.max([this.getBBox().width, (margin + this.getBBox().width / 2)]);
                    }
                    return Math.floor(this.getBBox().width / 2);
                })
                .attr("y", function (d) {
                    if (cfg.horizontalLayout) {
                        return Math.floor(cfg.height / 2 + (margin + this.getBBox().height));
                    }
                    return cfg.height - margin + this.getBBox().height / 2;
                });
        }

        svg.on("mousemove", function () {
                var tipPixels = parseInt(tip.style("height").replace("px", ""));
                return tip.style("top", (d3.event.pageY - tipPixels - margin) + "px").style("left", (d3.event.pageX + 20) + "px");
            })
            .on("mouseout", function () {
                return tip.style("opacity", 0).style("top", "0px").style("left", "0px");
            });

        // callback();
    }
};