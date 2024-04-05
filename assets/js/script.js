const baseURL='https://api.openweathermap.org/data/2.5/';
const options ='weather?q=atlanta&appid='
//const options ='weather?q=atlanta&appid=1f965d36035e44dfd7ce52a501d2500e'
const apikey=`1f965d36035e44dfd7ce52a501d2500e`
const form=$('form');
// let button_placeholder=$('#button_placeholder')



  async function  runSearch(event,Uinput){
    event.preventDefault()
    // $('#search_box').val('New York')
    const input=$('#search_box').val()
    // console.log(button_placeholder)
    $('#search_box').val('')
    const searchResult= await getWeather(input)
    // console.log(searchResult)
    const Name=searchResult.weather.name
    const Temperture=searchResult.weather.main.temp
    const TempertureMax=searchResult.weather.main.temp_max
    const TempertureMin=searchResult.weather.main.temp_min
    const Windspeed=searchResult.weather.wind.speed
    const humidity= searchResult.weather.main.humidity;
    const WeatherOBJ={
      Name:Name,
      Temperture:Temperture,
      TempertureMax:TempertureMax,
      TempertureMin:TempertureMin,
      Windspeed:Windspeed,
      humidity:humidity
    }
    
    PostWeather(WeatherOBJ)
    PostForcast(searchResult.forcast)

   // return WeatherOBJ
  }

  async function getWeather(cityname) {
    // const response = await fetch('https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid={1f965d36035e44dfd7ce52a501d2500e}');
    const country=`UK`
    const url=baseURL+`weather?q=${cityname},&appid=`+apikey+`&units=imperial`
    const urlForcast=`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apikey}&units=imperial`;
    let weatherOBJ={
      weather:null,
      forcast:null
    }
    let response = await fetch(url);
     weatherOBJ.weather= await response.json();

    response=await fetch(urlForcast);
    weatherOBJ.forcast=filterTime(await response.json());

    //filterTime(weatherOBJ.forcast)
    return weatherOBJ
  }


  function filterTime(OBJ){
    let arr=[]
      OBJ.list.forEach(element => {
        if(element.dt_txt.substr(11)=="12:00:00"){
          arr.push(element)
        }
      });
      //console.log(arr) 
      return arr
  }

  function PostWeather(OBJ){
    let Title = document.getElementById('City')
    let Temp = document.getElementById('temp')
    let Wind = document.getElementById('wind')
    let humidity=document.getElementById('humidity')
    Title.innerText=OBJ.Name
    Temp.innerText="Temperture: "+OBJ.Temperture+" F"
    Wind.innerText="Wind Speed: "+OBJ.Windspeed+" MPH"
    humidity.innerText="Humidity: "+OBJ.humidity+" %"
    console.log(OBJ)
    saveCity(OBJ.Name)
  }
  function PostForcast(arr){
    let placeholder=document.querySelector('.forcast')
    let  icon=`./assets/images/icons8-sunny.gif`;
    RemoveForcast()
    arr.forEach(element => {
      console.log(element)

      if(element.weather[0].main=='Clouds'){
        icon=`./assets/images/icons8-cloudy.gif`;
      }
      else if(element.weather[0].main=='Sunny'){
        icon=`./assets/images/icons8-sunny.gif`;
      } else if(element.weather[0].main=='Rain'){
        icon=`./assets/images/icons8-rain.gif`;
      }


      placeholder.insertAdjacentHTML('beforeend',`
      <div class="day rounded border Small shadow"> 
        <h5>${element.dt_txt.substr(0,10)}</h5>
        <h5>Temp: ${element.main.temp} F</h5>
        <h5>Wind: ${element.wind.speed}</h5>
        <h5>Humidity:${element.main.humidity}</h5>
        <img src=${icon}>
      </div>
      `)
      icon=`./assets/images/icons8-sunny.gif`;    
    });


  }
  function RemoveForcast(){
    let placeholder=document.querySelector('.forcast')
    let child = placeholder.lastElementChild;
    while (child) {
      placeholder.removeChild(child);
        child = placeholder.lastElementChild;
    }
  }

function saveCity(cityName){
  let newList=JSON.parse( localStorage.getItem('Cities'))||[]
  if(!newList.includes(cityName)){
    newList.push(cityName)
    newList=JSON.stringify(newList) 
    localStorage.setItem('Cities',newList)
    RenderSingleCityBtn(cityName)
  }
 
}

function RenderSingleCityBtn(cityName){
  let placeholder=document.getElementById('button_placeholder')
  placeholder.insertAdjacentHTML('beforeend',`
  <button class="savedWeather  btn btn-primary">${cityName}</button>
  `)

}

function RenderAllCityBtns(){
  let data=JSON.parse( localStorage.getItem('Cities'))||[]
  data.forEach(element => {
    RenderSingleCityBtn(element)
  });
}
  form.on('submit',runSearch)
  $('#button_placeholder').on('click','.savedWeather',function(){
    $('#search_box').val(this.innerText)
    runSearch(event)
  })
  RenderAllCityBtns()