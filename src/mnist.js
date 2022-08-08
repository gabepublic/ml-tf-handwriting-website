
// Model for edge inference using tensorflowjs
var model = null;

// UI variables
var welcome_msg, prediction_msg;

var current_digit;


function init() {
  console.log("init...");
  welcome_msg = document.getElementById("welcome_msg");
  renderMsg(welcome_msg,null,"Handwriting recognition");
  predictLocalButton = document.getElementById("predict-button-local");
  predictLocalButton.onclick = handlePredictLocalClickRev;
  prediction_msg = document.getElementById("prediction_msg");
  initTF();
}

async function initTF() {
  console.log("loading model...");
  //model = await tf.loadModel('/js/models/mnist/model.json');
  model = await tf.loadLayersModel('/models/mnist/model.json');
}


function handlePredictLocalClickRev(event) {
  console.log("Predict...");
  const arr = new Uint8ClampedArray(3136);
  var pi = 0;
  // Iterate through every pixel
  for (let i = 0; i < arr.length; i += 4) {
    pi = i/4;
    arr[i + 0] = pixels[pi];    // R value
    arr[i + 1] = pixels[pi];  // G value
    arr[i + 2] = pixels[pi];    // B value
    arr[i + 3] = 1;  // A value
  }
  // Initialize a new ImageData object
  let imageData = new ImageData(arr, 28);
  const tfImg = tf.browser.fromPixels(imageData, 1);
  var smalImg = tf.image.resizeBilinear(tfImg, [28, 28]);
  smalImg = tf.cast(smalImg, 'float32');
  var tensor = smalImg.expandDims(0);
  if (model) {
    const prediction = model.predict(tensor);
    const probabilities = prediction.dataSync();
    var max_prob = Math.max(...probabilities);   //JS Spread syntax
    var idx = "?";
    if (max_prob > 0.6) {
      idx = String(probabilities.indexOf(max_prob));
      current_digit = probabilities.indexOf(max_prob);

      // append to the number input
      number_input = document.getElementById("number");
      number_value = number_input.value;
      number_value_str = String(number_value) + idx;
      number_input.value = number_value_str;
    }
    console.log("idx, prob = ", idx, max_prob);
    msg =  "Your wrote: "+idx+" (probab.: "+(max_prob.toFixed(2)*100)+"%)";
    renderMsg(prediction_msg, null, msg);  
  }    
}


function renderMsg(msgDiv, err, msg) {
  if (!msgDiv) return;  // return if no place to put the message
  display_msg = "";
  if (err) {
    //console.log(err);
    display_msg = err;
  } else if (msg) {
    display_msg = msg;
  }

  var msg_node = document.createTextNode(display_msg);
  if (msgDiv.childNodes.length == 0) {
    msgDiv.appendChild(msg_node);
  } else {
    //console.log(msgDiv.childNodes)
    msgDiv.replaceChild(msg_node, msgDiv.childNodes[0]);
  }
}


function constructErrMsg(err) {
  errmsg = "";
  if (err) {
    //console.log(err);
    errmsg = err.result.error.message;
  }
  return msg;
}

function constructPredictionMsg(resp) {
  msg = "";
  if (resp) {
    //console.log(JSON.stringify(resp));
    // hack here because the key name is funky; "dense_8/Softmax:0"
    // redeploy model with TF layer name;
    var predictions = resp.result.predictions;
    var p0 = predictions[0];
    var key = Object.keys(p0)[0];
    var probabilities = p0[key];
    //console.log(probabilities);
    var max_prob = Math.max(...probabilities);   //JS Spread syntax
    var idx = "?";
    if (max_prob > 0.6) {
      idx = String(probabilities.indexOf(max_prob));
      current_digit = probabilities.indexOf(max_prob);

      // append to the number input
      number_input = document.getElementById("number");
      number_value = number_input.value;
      number_value_str = String(number_value) + idx;
      number_input.value = number_value_str;
    }
    //console.log("idx, prob = ", idx, max_prob);
    msg =  "Your wrote: "+idx+" (probab.: "+(max_prob.toFixed(2)*100)+"%)";
  }
  return msg;
}

function convertPixelToJSON() {
  var str_digit = "[";
  for (var y = 0; y < 28; y++){
    row = "[";
    for (var x = 0; x < 28; x++){
      row = row + "[" + pixels[(y*28)+x].toFixed(1) + "]";
      if (x<27) row = row + ", ";
    }
    row = row + "]";
    str_digit = str_digit + row;
    if (y<27) str_digit = str_digit + ", ";
  }
  str_digit = str_digit + "]";
  var req_json = '{"instances": [{"input_image": ' + str_digit + '}]}'; 
  //console.log("request = ", req_json);
  return req_json;
}