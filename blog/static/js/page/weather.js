bindEvents.weather = function() {
    $('#id-weather').click(function() {
        var city = 'shanghai'
        api.weather(city, function(r) {
            var i = $('.weather-block').css('display')
            if (i == 'none') {
                insertHeweather(r)
                $('.weather-block').fadeIn('slow')
                autoClose($('.weather-block'), 5000)
            } else {
                $('.weather-block').fadeOut('slow')
            }
        })
    })
}

const insertHeweather = (data) => {
    //传递的原始数据就是JSON格式，要再一次parse
    var p = JSON.parse(data)
    var obj = p.HeWeather5[0]
    var daily = obj.daily_forecast
    var city = obj.basic.city
    var date = []
    var max = []
    var min = []
    for (var i = 0; i < daily.length; i++) {
        var day = daily[i]
        date.push(day.date)
        var m1 = Number(day.tmp.max)
        max.push(m1)
        var m2 = Number(day.tmp.min)
        min.push(m2)
    }
    setChart(city, date, max, min)
}

const setChart = (city, date, max, min) => {
    var c = e('.weather')
    var myChart = echarts.init(c)
    var option = {
        title: {
            text: `${city}：三天内气温变化`,
            subtext: '和风天气',
            textStyle: {
                color: 'white'
            },
            subtextStyle: {
                color: 'white'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['最高气温','最低气温'],
            textStyle: {
                color: '#fff'
            },
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            },
            iconStyle: {
                normal: {
                    color: 'white'
                }
            },
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: date,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                },
            },
            axisLine:{
                lineStyle:{
                    color:'#fff'
                },
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C',
                textStyle: {
                    color: '#fff'
                }
            },
            axisLine:{
                lineStyle:{
                    color:'#fff'
                }
            },
            max: 40,
            min: 0,
            splitNumber: 8,
        },
        series: [
            {
                name:'最高气温',
                type:'line',
                data: max,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'最低气温',
                type:'line',
                data: min,
                markPoint: {
                    data: [
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'},
                        [{
                            symbol: 'none',
                            x: '90%',
                            yAxis: 'max'
                        }, {
                            symbol: 'circle',
                            label: {
                                normal: {
                                    position: 'start',
                                    formatter: '最大值'
                                }
                            },
                            type: 'max',
                            name: '最高点'
                        }]
                    ]
                }
            }
        ]
    }
    myChart.setOption(option)
}

const autoClose = (dom, time) => {
    setTimeout(function(){
        var i = $('.weather-block').css('display')
        if (i != 'none') {
            dom.fadeOut('slow')
        }
    }, time)
}
