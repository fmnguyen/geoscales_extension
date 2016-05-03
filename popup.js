var result;
var lat;
var lon;

chrome.extension.onMessage.addListener( function(message,sender,sendResponse) {
  //if(message.stuff == "done")
    //window.close();
});

$(document).ready(function () {

  chrome.storage.sync.get(function(data) {
    console.log('Your current location is: ' + data.location)
    console.log('lon: ' + data.lon + ', lat: ' + data.lat );
  });

  $("#searchBox").autocomplete({
      source: function (request, response) {
          $.ajax({
              url: "https://dev.virtualearth.net/REST/v1/Locations",
              countryRegion: 'US',
              dataType: "json",
              data: {
                  key: "AhLlK-nI7fJvXr7VViCTVzu6HlhZrkR7G9bsGhe1Ip7aOpsvSRThphl8LL3308KI",
                  q: request.term
              },
              jsonp: "jsonp",

              success: function (data) {
                  result = data.resourceSets[0];
                  console.log(result);
                  if (result) {
                      if (result.estimatedTotal > 0) {
                          response($.map(result.resources, function (item) {
                              if(item.address.countryRegion == 'United States') {
                              return {
                                  data: item,
                                  value: item.name
                              }
                          }
                          }));
                      }
                  }
              }
          });
      },
      minLength: 1
  }); //searchbox autocomplete ready

  $('.ui-autocomplete').click(function() {
        
        lat = result['resources'][0]['bbox'][0];
        lon =  result['resources'][0]['bbox'][1];
  }) 

  $('#startAtlas').click(function() {
    try {
        lat = result['resources'][0]['bbox'][0];
        lon = result['resources'][0]['bbox'][1];
        var location = result['resources'][0]['name'];

        if($('#saveItForLater').is(':checked')) {
          saveAddress(lat, lon, location); 
        }

        $('#err').empty();
        wheel = chrome.extension.getURL("images/loading.gif")
        $('#wheel').append("<center><img id='loadingWheel' src='images/loading.gif'></center>");
        // $('#previousAddress').empty();
        chrome.tabs.query({active:true,currentWindow:true}, function(tab) {
            chrome.tabs.sendMessage(tab[0].id, {lat:lat,lon:lon});
        });
        
        // $('#previousAddress').append("<br> <u>Use this address: " +result['resources'][0]['name'] +  "</u>")
    }

    catch(err) {
        $('#err').append("<br>Use autocomplete function to enter your address.")
    }

  })

  /**
   * Saves the latitude, longitude and location name of the 
   * saved address for users in chrome.storage
   * @param  {[int]}    lat      latitude of location used for plotly chart
   * @param  {[int]}    lon      longitude of location used for plotly chart
   * @param  {[string]} location location by name that appears in auto-complete
   */
  function saveAddress(lat, lon, location) {
    chrome.storage.sync.set({
      'location': location,
      'lat': lat,
      'lon': lon
    }, function() {
      console.log('saved');
    });
  }

}); // doc ready
