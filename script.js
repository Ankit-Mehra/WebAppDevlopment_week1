'use strict';

function updateClicks(){
  let clicks = {}
  function reportClicks(item){
    clicks[item] = clicks[item]+1|| 1;
    console.log(item,clicks);
  }
  return reportClicks;
}
const reportActivities = updateClicks();
const reportProducts = updateClicks();
const  listWidget = (function(){
  const activities = {
    teamIn: ['basketball','hockey','volleyball'],
    teamOutWarm: ['softball/baseball','football/soccer','American football','rowing','tennis','volleyball','ultimate frisbee','rugby'],
    teamOutCold: ['hockey'],
    soloIn: ['rock climbing','swimming','ice skating'],
    soloOutWarm: ['rowing','running','hiking','cycling','rock climbing'],
    soloOutCold: ['snowshoeing','downhill skiing','cross-country skiing','ice skating']
  };
  let state = {};
  let category = 'all';
  return  {
    url : 'http://api.openweathermap.org/data/2.5/weather?q=',
    apiKey : "2647be44acf54659adbcccd40c0256c1", // Replace "APIKEY" with your own API key; otherwise, your HTTP request will not work
    updateActivityList:function(event) {
      if (event !== undefined && event.target.classList.contains('selected')) {
        return true;
      } else if (event !== undefined && !event.target.classList.contains('selected')) {
        category = event.target.id;
        document.querySelectorAll('.options div').forEach(function(el) {
          el.classList.remove('selected');
        });
        event.target.classList.add('selected');
      } 

      state.activities = [];
      if (state.condition === "Rain") {
        updateState('In');
      } else if (state.condition === "Snow" || state.degFInt < 50) {
        updateState('OutCold');
      } else {
        updateState('OutWarm');
      }

      function updateState(type) {
        if (category === 'solo') {
          state.activities.push(...activities['solo' + type]);
        } else if (category === 'team') {
          state.activities.push(...activities['team' + type]);
        } else {
          state.activities.push(...activities['solo' + type]);
          state.activities.push(...activities['team' + type]);
        }
      }

      let activitiesContainer = `<ul>`;
      state.activities.forEach(function(activity,index) {
        activitiesContainer += `<li key="${index}">${activity}</li>`
      });
      activitiesContainer += `</ul>`;
      
      document.querySelector('.activities').innerHTML = activitiesContainer;
      document.querySelector('.results').classList.add('open');
    },
    updateUIWorking : function(){
      var count = [0,1,2,3,4,5,6,7,8,9]
      count.forEach(function(el){
        setTimeout(function(){
          document.querySelector('.conditions').innerHTML = `<p class = "animation">00.00.${el}</p>`;
        },100*el)
      })
      // for (let i= 0 ;i<=9;i++){
      //   setTimeout(function(){
      //     document.querySelector('.conditions').innerHTML = `<p class = "animation">00.00.${i}</p>` ;
      //   },100*i);
      // }
    },
    updateUISuccess:function(response) {
      const degC = response.main.temp - 273.15;
      const degF = degC * 1.8 + 32;
      state = {
        condition: response.weather[0].main,
        icon: 'https://openweathermap.org/img/w/' + response.weather[0].icon + '.png',
        degCInt: Math.floor(degC),
        degFInt: Math.floor(degF),
        city: response.name
      };

      document.querySelector('.conditions').innerHTML = `
        <p class="city">${state.city}</p>
        <p>${state.degCInt}\u00B0 C / ${state.degFInt}\u00B0 F
          <img src="${state.icon}" alt="${state.condition}">
        </p>
      `; 

      listWidget.updateActivityList();
    },
     updateUIFailure:function() {
      document.querySelector('.conditions').textContent = 'Weather information unavailable';
    }
  }
})();

// get weather data when user clicks Forecast button, then add temp & conditions to view
document.querySelector('.forecast-button').addEventListener('click', function(e) {
  e.preventDefault();
  listWidget.updateUIWorking();

  const location = document.querySelector('#location').value;
  document.querySelector('#location').value = '';
  // fetch(listWidget.url + location + '&appid=' + listWidget.apiKey).then(function(response) {
  //   return(response.json());
  // }).then(function(response) {
  //   listWidget.updateUISuccess(response);
  // }).catch(function() {
  //   listWidget.updateUIFailure();
  // });
}, false);

// update list of sports when user selects a different category (solo/team/all)
document.querySelectorAll('.options div').forEach(function(el) {
  el.addEventListener('click', function(event) {
    listWidget.updateActivityList(event);
    reportActivities(event.target.id);
  }, false);
});

document.querySelectorAll('.product-image').forEach(function(el){
  el.addEventListener('mouseenter',function(event){
    reportProducts(event.target.nextElementSibling.textContent)
  },false);
})