
const chartStore = {
pie: null,
}

const typeArray = function(arr) {
    let typeArr = []
    for (var i = 0; i < arr.length; i++) {
        let ele = arr[i]
        let type = ele.type
        if (type != undefined) {
            typeArr = [...typeArr, ...type]
        }
    }
    return typeArr
}

const typeNumber = function(arr) {
    let typeNumber = {}
    for (var i = 0; i < arr.length; i++) {
        let ele = arr[i]
        if (typeNumber.hasOwnProperty(ele)) {
            typeNumber[ele] += 1
        }
        else {
            typeNumber[ele] = 1
        }
    }
    return typeNumber
}

const echartData = function(obj) {
    let data = []
    let keyarray = Object.keys(obj)
    for (var i = 0; i < keyarray.length; i++) {
        let ele = keyarray[i]
        let objEle = {}
        objEle.value = obj[ele]
        objEle.name = ele
        data.push(objEle)
    }
    return data
}

const typeName = function(arr) {
    let typeArr = typeArray(arr)
    let typeNum = typeNumber(typeArr)
    let keyarray = Object.keys(typeNum)
    return keyarray
}

const getTypeData = function(arr) {
    let typeArr = typeArray(arr)
    let typeNum = typeNumber(typeArr)
    let Data = echartData(typeNum)
    return Data
}

const getOption = function(typename, typeData) {
    option = {
    title : {
        text: '时光网TOP100类型构成',
        subtext: '资源来自时光网',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: typename
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '65%',
            center: ['50%', '50%'],
            data: typeData,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    return option
}

const renderChart = function(typename, typeData) {
    const option = getOption(typename, typeData)
    const pie = chartStore.pie
    //DOM对象绑定option参数
    pie.setOption(option)
}

const initedChart = function() {
    _.each(chartStore, (v, k) => {
    const element = document.querySelector('#pie-echart')
    const chart = echarts.init(element)
    chartStore[k] = chart
    })
}

callBack.movieGet = function(arr) {
    //将对应的DOM元素绑定到chartStore对象的每个成员键上
    initedChart()
    //拿到了符合echart饼状图的格式的数据
    let typeData = getTypeData(arr)
    let typename = typeName(arr)
    renderChart(typename, typeData)
}

bindEvents.movieGet = function() {
    var button = document.querySelector('#id-movies')
    button.addEventListener('click', function() {
        let swalMovie = {
            title: "时光网电影TOP100",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        }
        swal(swalMovie, function(){
            api.movieGet(function(response) {
                swal('数据已获取')
                //得到了100部电影的数据对象数组
                callBack.movieGet(response)
            })
        })
    })
}
