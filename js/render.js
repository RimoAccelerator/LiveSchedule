var keyTimes
let groups = []
let openTime = ""
let closeTime = ""
let name = ""
let place = ""
let date = ""
document.addEventListener('DOMContentLoaded', function() {
    // 获取 URL 查询字符串
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var encodedData = urlParams.get('data');
    var encodedName = urlParams.get('name');
    var encodedDate = urlParams.get('date');
    var encodedLocation = urlParams.get('location');
    var encodedLiveStart = urlParams.get('liveStart');
    var encodedLiveEnd = urlParams.get('liveEnd');

    if (encodedName){
    	document.getElementById('liveName').innerHTML = decodeURIComponent(encodedName)
    }

    if (encodedDate && encodedLocation){
    	document.getElementById('liveDateAndLocation').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;' + decodeURIComponent(encodedLocation) 
    	+ ' | ' + decodeURIComponent(encodedDate) + '&nbsp;&nbsp;&nbsp;&nbsp;'
    }

    if (encodedLiveStart && encodedLiveEnd){
    	openTime = decodeURIComponent(encodedLiveStart)
    	closeTime = decodeURIComponent(encodedLiveEnd)
    }

    if (encodedData) {
        var jsonData = decodeURIComponent(encodedData); // 解码 JSON 数据
        let info = JSON.parse(jsonData);
        // 在这里可以进一步处理传递的数据
        for(let i = 0; i < info.length; i++)
        {
        	if(info[i].start != '')  groups.push(info[i])
        }
        renderSvg()
    }
});

function renderSvg()
{
	/*
	const info = '{\
		"groups":\
		[\
			{\
			"name": "心率研究所",\
			"start": "12:30",\
			"end": "13:00",\
			"meet": {\
			"start": "13:00",\
			"end":"14:30",\
			"location":"A"\
			}},\
			{\
			"name": "繁星交响曲",\
			"start": "13:00",\
			"end": "13:30",\
			"meet": {\
			"start": "13:30",\
			"end":"14:10",\
			"location":"B"\
			}},\
			{\
			"name": "月令时Mirage",\
			"start": "13:30",\
			"end": "14:20",\
			"meet": {\
			"start": "12:30",\
			"end":"13:00",\
			"location":"B"\
			}},\
			{\
			"name": "Wi Sugar",\
			"start": "16:00",\
			"end": "18:30",\
			"meet": {\
			"start": "13:30",\
			"end":"14:10",\
			"location":"D"\
			}},\
			{\
			"name": "True Mask",\
			"start": "14:30",\
			"end": "15:00",\
			"meet": {\
			"start": "15:00",\
			"end":"15:50",\
			"location":"C"\
			}}\
		]\
		}'
		*/

	keyTimes = getKeyTimesBetweenTwoTime(openTime, closeTime)

	console.log(groups.length)
	let heightScaleFactor = parseInt(keyTimes.length / 8 + 1)
	document.getElementById('mainCanvas').setAttribute('height', (heightScaleFactor * 100).toString() + '%')

	addTimeGrid(openTime, closeTime, heightScaleFactor)
	setColor(groups)
	addLive(groups, heightScaleFactor)
	addMeet(groups, heightScaleFactor)
}

function addTimeGrid(openTime, closeTime, heightScaleFactor)
{
	let svg = document.getElementById('mainCanvas')
	let startY = 22  / heightScaleFactor
	
	let endY = 90 // // / heightScaleFactor
	let thisY = startY
	for (let i = 0; i < keyTimes.length; i++)
	{
		// add a line here
		thisY = getYFromTime(keyTimes[i], keyTimes[0], keyTimes[keyTimes.length - 1], startY, endY - 5)
		let thisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
		//<line x1=25% y1=22% x2=85% y2=22% stroke="grey" stroke-width=5 opacity=0.6 />
		thisLine.setAttribute('x1','25%')
		thisLine.setAttribute('x2','90%')
		thisLine.setAttribute('y1',thisY.toString() + '%')
		thisLine.setAttribute('y2',thisY.toString() + '%')
		thisLine.setAttribute('stroke','grey')
		thisLine.setAttribute('stroke-width','5')
		thisLine.setAttribute('opacity','0.3')
		svg.appendChild(thisLine)
	}
	/*
	<svg x=35% y=y_line - 2% width=5% height=3%>
			<rect width=100% height=100% fill="white" opacity=1.0  stroke="black" stroke-width=4 />
			<text  alignment-baseline="middle" text-anchor="middle" font-size=20 font-family="Times New Roman, NSimSun"  xml:space="preserve" 
			fill="black" x=50% y=50% stroke="black" stroke-width=2 >
			 13:30 
			</text>
		</svg>
	*/
	for (let i = 0; i < keyTimes.length; i++)
	{
		// add a line here
		thisY = getYFromTime(keyTimes[i], keyTimes[0], keyTimes[keyTimes.length - 1], startY, endY - 5)
		let thisChildSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		//<line x1=25% y1=22% x2=85% y2=22% stroke="grey" stroke-width=5 opacity=0.6 />
		thisChildSvg.setAttribute('x','35%')
		thisChildSvg.setAttribute('y',(thisY - 2).toString() + '%')
		thisChildSvg.setAttribute('width','5%')
		thisChildSvg.setAttribute('height','3%')
		thisStrokeBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		thisStrokeBox.setAttribute('width','100%')
		thisStrokeBox.setAttribute('height','100%')
		thisStrokeBox.setAttribute('fill','white')
		thisStrokeBox.setAttribute('opacity','1.0')
		thisStrokeBox.setAttribute('stroke','black')
		thisStrokeBox.setAttribute('stroke-width','4')
		thisChildSvg.appendChild(thisStrokeBox)
		thisTimeLable = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		thisTimeLable.setAttribute('alignment-baseline','middle')
		thisTimeLable.setAttribute('text-anchor','middle')
		thisTimeLable.setAttribute('font-size','2.5cqmin')
		thisTimeLable.setAttribute('font-family','Times New Roman, NSimSun')
		thisTimeLable.setAttribute('xml:space','preserve')
		thisTimeLable.setAttribute('fill','black')
		thisTimeLable.setAttribute('x','50%')
		thisTimeLable.setAttribute('y','50%')
		thisTimeLable.setAttribute('stroke','black')
		thisTimeLable.setAttribute('stroke-width','2')
		thisTimeLable.setAttribute('style','  text-shadow: 1px 0 2px black;')
		thisTimeLable.appendChild(document.createTextNode(getTimeFromMinutes(keyTimes[i])))
		thisChildSvg.appendChild(thisTimeLable)
		svg.appendChild(thisChildSvg)
	}
}


function getRandomColor()
{    
    return  '#' + (function(color){    
         return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
         && (color.length == 6) ?  color : arguments.callee(color);    
    })('');    
 }

function setColor(groups)
{
	for (let i = 0; i < groups.length; i++)
	{
		groups[i].color = getRandomColor()
	}
	return groups
}
 

function addLive(groups, heightScaleFactor)
{
	
	/*
	<svg x=5% y=30% width=20% height=10%>
			<rect width=100% height=100% fill="blue" opacity=0.3 />
			<text  alignment-baseline="middle" text-anchor="middle" font-size=40 
			font-family="Times New Roman, NSimSun"  
			xml:space="preserve" fill="black" x=50% y=50%>
				Wi Sugar
			</text>
		</svg>
		*/
	let svg = document.getElementById('mainCanvas')
	let startY = 22  / heightScaleFactor
	let endY = 90 // / heightScaleFactor
	let thisY = startY
	//let keyTimes = getKeyTimesBetweenTwoTime(openTime, closeTime)
	for (let i = 0; i < groups.length; i++)
	{
		y1 = getYFromTime(getMinutesFromTime(groups[i].start), keyTimes[0], keyTimes[keyTimes.length - 1], startY, endY - 5)
		y2 = getYFromTime(getMinutesFromTime(groups[i].end), keyTimes[0], keyTimes[keyTimes.length - 1], startY, endY - 5)
		height = y2 - y1
		let thisChildSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		//<line x1=25% y1=22% x2=85% y2=22% stroke="grey" stroke-width=5 opacity=0.6 />
		thisChildSvg.setAttribute('x','5%')
		thisChildSvg.setAttribute('y',y1.toString() + '%')
		thisChildSvg.setAttribute('width','20%')
		thisChildSvg.setAttribute('height',height.toString() + '%')
		let thisFilledBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		thisFilledBox.setAttribute('width','100%')
		thisFilledBox.setAttribute('height','100%')
		thisFilledBox.setAttribute('opacity','0.3')
		thisFilledBox.setAttribute('fill',groups[i].color) // Select a color
		let thisGroupName = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		thisGroupName.setAttribute('alignment-baseline','middle')
		thisGroupName.setAttribute('text-anchor','middle')
		//thisGroupName.setAttribute('font-size','5cqmin')
		//thisGroupName.setAttribute('font-family','Times New Roman, NSimSun')
		//thisGroupName.setAttribute('font-weight','bold')
		thisGroupName.setAttribute('xml:space','preserve')
		thisGroupName.setAttribute('fill','black')
		thisGroupName.setAttribute('x','50%')
		thisGroupName.setAttribute('y','50%')
		thisGroupName.setAttribute('style', 'font-family: "Times New Roman", "SimSun"; \
			 font-size:5cqmin; font-weight: bold; text-shadow: 1px 0 2px black; \
			')
		thisGroupName.appendChild(document.createTextNode(groups[i].name))
		thisChildSvg.appendChild(thisFilledBox)
		thisChildSvg.appendChild(thisGroupName)
		svg.appendChild(thisChildSvg)
	}
}

function addMeet(groups, heightScaleFactor)
{
	let locations = new Array()
	for (let i = 0; i < groups.length; i++)
	{
		g = groups[i]
		if(g.meet.location == '') continue
		if(locations.indexOf(g.meet.location) == -1)
			locations.push(g.meet.location)
	}
	let svg = document.getElementById('mainCanvas')
	let startX = 45 
	let endX = 90 
	let startY = 22 / heightScaleFactor
	let endY = 90 // / heightScaleFactor
	let thisY = startY
	let width = (endX - startX) / locations.length
	for (let i = 0; i < locations.length; i++) //add grids and labels for each location
	{
		let thisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
		//<line x1=25% y1=22% x2=85% y2=22% stroke="grey" stroke-width=5 opacity=0.6 />
		thisLine.setAttribute('x1',(startX + i * width).toString() + '%')
		thisLine.setAttribute('x2',(startX + i * width).toString() + '%')
		thisLine.setAttribute('y1',startY.toString() + '%')
		thisLine.setAttribute('y2',endY.toString() + '%')
		thisLine.setAttribute('stroke','grey')
		thisLine.setAttribute('stroke-width','5')
		thisLine.setAttribute('opacity','0.3')
		svg.appendChild(thisLine)
		let thisChildSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		thisChildSvg.setAttribute('x',(startX + i * width).toString() + '%')
		thisChildSvg.setAttribute('y','90%')
		thisChildSvg.setAttribute('width',width.toString() + '%')
		thisChildSvg.setAttribute('height','10%')
		let thisLocationContainer = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
		thisLocationContainer.setAttribute('width','100%')
		thisLocationContainer.setAttribute('height','100%')
		let div = document.createElement('div')
		div.setAttribute('style', 'width:100%; height:100%; container-type: inline-size;\
			display:flex; justify-content:center;align-items:center;')
		let p = document.createElement('p')
		p.appendChild(document.createTextNode(locations[i]))
		p.setAttribute('style', 'font-family: fantasy, "Arial", "SimHei", Sans-Serif;  font-size:15cqmin; \
			font-weight: normal;  text-shadow: 0 0 2px black;')
		div.appendChild(p)
		thisLocationContainer.appendChild(div)
		thisChildSvg.appendChild(thisLocationContainer)
		svg.appendChild(thisChildSvg)
	}
	for (let i = 0; i < groups.length; i++)
	{
		/*
		<svg x=45% y=30% width=5% height=20%>
			<rect width=100% height=100% fill="yellow" opacity=0.3 />
			<text  alignment-baseline="middle" text-anchor="middle" font-size=30 font-family="Times New Roman, NSimSun" 
			 xml:space="preserve" fill="black" x=50% y=50% style="writing-mode: tb">
				Wi Sugar
			</text>
		</svg>
		*/
		g = groups[i]
		if(g.meet.start == '') continue
		y1 = getYFromTime(getMinutesFromTime(g.meet.start), keyTimes[0], keyTimes[keyTimes.length - 1], startY, endY - 5)
		y2 = getYFromTime(getMinutesFromTime(g.meet.end), keyTimes[0], keyTimes[keyTimes.length - 1], startY, endY - 5)
		height = y2 - y1
		let thisChildSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		//<line x1=25% y1=22% x2=85% y2=22% stroke="grey" stroke-width=5 opacity=0.6 />
		thisChildSvg.setAttribute('x',(startX + width * locations.indexOf(g.meet.location)).toString() + '%')
		thisChildSvg.setAttribute('y',y1.toString() + '%')
		thisChildSvg.setAttribute('width',width.toString() + '%')
		thisChildSvg.setAttribute('height',height.toString() + '%')
		let thisFilledBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		thisFilledBox.setAttribute('width','100%')
		thisFilledBox.setAttribute('height','100%')
		thisFilledBox.setAttribute('opacity','0.3')
		thisFilledBox.setAttribute('fill',g.color) // Select a color
		let thisGroupNameContainer = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
		thisGroupNameContainer.setAttribute('width','100%')
		thisGroupNameContainer.setAttribute('height','100%')
		let div = document.createElement('div')
		div.setAttribute('style', 'width:100%; height:100%; container-type: inline-size;\
			display:flex; justify-content:center;align-items:center;')
		let p = document.createElement('p')
		p.appendChild(document.createTextNode(g.name))
		p.setAttribute('style', 'font-family: "Times New Roman", "SimSun"; \
			 writing-mode: vertical-rl; font-size:10cqmin; font-weight: bold; text-shadow: 1px 0 2px black; \
			')
		//p.setAttribute('style', 'font-family: "Times New Roman", "SimSun"; \
		//	  font-size:10cqmin; font-weight: bold; text-shadow: 1px 0 2px black; \
		//	')
		div.appendChild(p)
		thisGroupNameContainer.appendChild(div)
		thisChildSvg.appendChild(thisFilledBox)
		thisChildSvg.appendChild(thisGroupNameContainer)
		svg.appendChild(thisChildSvg)
	}
}

function getYFromTime(timeNum, startTime, endTime, startY, endY)
{
	return startY + (timeNum - startTime) / (endTime - startTime) * (endY - startY)
}

function getMinutesFromTime(time)
{
	timeSplitted = time.split(":")
	return parseInt(timeSplitted[0]) * 60 + parseInt(timeSplitted[1])
}
function getTimeFromMinutes(minutes)
{
	let hours = parseInt(minutes / 60)
	minutes = minutes % 60
	let minutesString = minutes.toString()
	if(minutes < 10)
		minutesString = '0' + minutesString
	return hours.toString() + ':' + minutesString
}
function getKeyTimesBetweenTwoTime(time1, time2) //calculate the minutes between two timestrings HH:mm
{
	let keyTimes = new Array()
	let latestHalf = getMinutesFromTime(time1)
	keyTimes.push(latestHalf)
	latestHalf = 30 * parseInt(latestHalf / 30 + 1)
	while(latestHalf < getMinutesFromTime(time2))
	{
		keyTimes.push(latestHalf)
		latestHalf += 30
	}
	keyTimes.push(getMinutesFromTime(time2))
	return keyTimes
}