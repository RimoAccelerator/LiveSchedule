
document.addEventListener('DOMContentLoaded', function() {

     var form = document.getElementById('liveInfo');
     

    form.addEventListener('submit', function(event) {
        var groups = []; 
        event.preventDefault(); 
        var names = document.getElementsByName('name[]');
        var starts = document.getElementsByName('start[]');
        var ends = document.getElementsByName('end[]');
        var meetStarts = document.getElementsByName('meetStart[]');
        var meetEnds = document.getElementsByName('meetEnd[]');
        var locations = document.getElementsByName('location[]');
        for (var i = 0; i < names.length; i++) {
            var item = {
                name: names[i].value,
                start: starts[i].value,
                end: ends[i].value,
                meet: {
                    start: meetStarts[i].value,
                    end: meetEnds[i].value,
                    location: locations[i].value
                }
                
            };
            groups.push(item); 
        }

        var jsonData = JSON.stringify(groups); // 将 groups 转换为 JSON 字符串
        var encodedData = encodeURIComponent(jsonData); // 编码 JSON 数据

        // 构建带参数的 URL
        var url = 'render.html?name=' + encodeURIComponent(document.getElementById('liveName').value) + 
        '&location=' + encodeURIComponent(document.getElementById('liveLocation').value) + 
        '&date=' + encodeURIComponent(document.getElementById('liveDate').value) + 
        '&liveStart=' + encodeURIComponent(document.getElementById('liveStart').value) + 
        '&liveEnd=' + encodeURIComponent(document.getElementById('liveEnd').value) + 
        '&data=' + encodedData;

        // 打开新的 HTML 文件
        var newWindow = window.open(url, '_blank');


    });

    var formContainer = document.getElementById('formContainer');
    var addButton = document.getElementsByClassName('add-row')[0];
    
    addButton.addEventListener('click', function() {
        var newRow = document.createElement('div');
        newRow.className = 'form-row';
        newRow.innerHTML = `
                <input type="text" name="name[]">
                <input type="time" name="start[]" >
                <input type="time" name="end[]" >
                <input type="time" name="meetStart[]" >
                <input type="time" name="meetEnd[]" >
                <input type="text" name="location[]" >
        `;
        
        formContainer.appendChild(newRow);
    });
});


