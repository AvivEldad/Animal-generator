$(document).ready(function () {
    getDate();
    var data = [];
    $(".box").click(function () {
        let url = 'https://zoo-animal-api.herokuapp.com/animals/rand/' + $(this).text();
        $.ajax({
            url: url,
            type: 'GET',
            datatype: 'json',
            success: function (response) {
                data = response;
                createTable(response);
            },
            error: function () {
                console.log('There was some error performing the AJAX call!');
                $("main").html("<h1 class='text-primary'>Oops!<h1><h2  class='text-primary'>something went wrong. refresh the page<h2><img src = 'https://previews.123rf.com/images/popaukropa/popaukropa1703/popaukropa170300085/73470678-error-404-panda-surprise-page-not-found-template-for-website-china-bear-does-not-know-and-is-surpris.jpg'>");
            }
        });
    });

    $('body').on('click', 'img', function () {
        let index;
        for (index = 0; index < data.length; index++) {
            if (data[index].image_link == this.src) {
                break;
            }
        }
        let details = "Family: " + ((data[index].animal_type !== undefined) ? data[index].animal_type : "") + "\r\n";
        details += "Food: " + ((data[index].diet !== undefined) ? data[index].diet : "") + "\r\n";
        details += "Life span (years): " + ((data[index].lifespan !== undefined) ? data[index].lifespan : "") + "\r\n";
        details += "Min length (meters): " + ((data[index].length_min !== undefined) ? (data[index].length_min * 0.3048).toFixed(2) : "") + "\r\n";
        details += "Max length (meters): " + ((data[index].length_max !== undefined) ? (data[index].length_max * 0.3048).toFixed(2) : "") + "\r\n";
        details += "Min weight (kg): " + ((data[index].weight_min !== undefined) ? (data[index].weight_min * 0.45359237).toFixed(2) : "") + "\r\n";
        details += "Max weight (kg): " + ((data[index].weight_max !== undefined) ? (data[index].weight_max * 0.45359237).toFixed(2) : "") + "\r\n";
        details += "views in the last week: " + week_views(data[index].name);
        swal({
            title: data[index].name,
            text: details,
            button: "close",
        });

    })

});

//Create a table with an animal name and an image
function createTable(data) {

    $("#photos").html("<table class='table table-image'><tbody id='myTable'>  </tbody></table>");
    let table = document.getElementById('myTable');
    for (let i = 0; i < data.length; i += 2) {
        let row = `<tr>
                    <td class = 'a_name'>${data[i].name}</td><td></td>
                    <td class = 'a_name'>${data[i + 1].name}</td>
                    </tr>
                    <tr>
                    <td><img src = ${data[i].image_link} width = 270px height = 200px></td><td class = "info"></td>            
                    <td><img src = ${data[i + 1].image_link} width = 270px height = 200px></td><td class = "info"></td>
                       
                    </tr> `
        table.innerHTML += row
    }

}


//Send an Ajax call to the server and get the current date in d/m/y pattern
function getDate() {
    $.ajax({

        url: 'get_current_date.php',
        type: 'GET',
        datatype: 'html',
        success: function (response) {
            $("#date").html(response);
            console.log(response);
        },
        error: function () {
            console.log('There was some error performing the AJAX call!');
            $("#date").html("no date");
        }

    });
}


//get the last weekly views on wikimedia of a given animal
function week_views(name) {
    let url = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/" + name + "/daily/";
    let d = new Date();
    d = new Date(Date.now() - 604800000);
    url += d.getFullYear() + ((d.getMonth() + 1) < 10 ? "0" : "") + (d.getMonth() + 1) + (d.getDate() < 10 ? "0": "") +d.getDate() + "/";
    d = new Date();
    url += d.getFullYear() + ((d.getMonth() + 1) < 10 ? "0" : "") + (d.getMonth() + 1) + (d.getDate() < 10 ? "0": "") +d.getDate();
    let sum = 0;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        'async': false,
        success: function (response) {
            sum = response.items.reduce((res, i) => res + i.views, 0);
        },
        error: function () {
            console.log('There was some error performing the AJAX call!');
            sum = "";
        }
    });
    return sum;
}