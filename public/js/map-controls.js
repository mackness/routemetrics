/**
 * The start button begins the tracking routine
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '45px';
  controlUI.style.textAlign = 'center';
  controlUI.style.backgroundColor = '#2ecc71';
  controlUI.style.transition = 'backgroundColor 250ms linear';
  controlUI.title = 'Tap to start tracking';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = '#fff';
  controlText.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '20px';
  controlText.style.paddingRight = '20px';
  controlText.innerHTML = 'START';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
  	document.body.classList.add('tracking-active');
    console.debug('tracking_started');
    controlUI.style.backgroundColor = '#c0392b';
    controlText.innerHTML = 'STOP';
  });

}









