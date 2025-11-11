var jsPsychSliderResponse = (function (jspsych) {
  'use strict';

  const info = {
      name: "slider-response",
      parameters: {
          /** Maintain the aspect ratio after setting width or height */
          maintain_aspect_ratio: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Maintain aspect ratio",
              default: true,
          },
          /** Sets the minimum value of the slider. */
          min: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Min slider",
              default: 0,
          },
          /** Sets the maximum value of the slider */
          max: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Max slider",
              default: 100,
          },
          /** Sets the starting value of the slider */
          slider_start: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Slider starting value",
              default: 50,
          },
          /** Sets the step of the slider */
          step: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Step",
              default: 1,
          },
          /** Array containing the labels for the slider. Labels will be displayed at equidistant locations along the slider. */
          labels: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Labels",
              default: [],
              array: true,
          },
          /** Width of the slider in pixels. */
          slider_width: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Slider width",
              default: null,
          },
          /** Label of the button to advance. */
          button_label: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Button label",
              default: "Continue",
              array: false,
          },
          /** If true, the participant will have to move the slider before continuing. */
          require_movement: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Require movement",
              default: false,
          },
          /** Any content here will be displayed below the slider. */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Prompt",
              default: null,
          },
          /** How long to show the trial. */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
          /** If true, trial will end when user makes a response. */
          response_ends_trial: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Response ends trial",
              default: true,
          },
          /**
           * If true, the image will be drawn onto a canvas element (prevents blank screen between consecutive images in some browsers).
           * If false, the image will be shown via an img element.
           */
          render_on_canvas: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Render on canvas",
              default: true,
          },
      },
  };
  /**
   * **image-slider-response**
   *
   * jsPsych plugin for showing an image stimulus and getting a slider response
   *
   * @author Josh de Leeuw
   * @see {@link https://www.jspsych.org/plugins/jspsych-image-slider-response/ image-slider-response plugin documentation on jspsych.org}
   */
  class ImageSliderResponsePlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          var height, width;
          var html;
          // half of the thumb width value from jspsych.css, used to adjust the label positions
          var half_thumb_width = 7.5;
          if (trial.render_on_canvas) {
              var image_drawn = false;
              // first clear the display element (because the render_on_canvas method appends to display_element instead of overwriting it with .innerHTML)
              if (display_element.hasChildNodes()) {
                  // can't loop through child list because the list will be modified by .removeChild()
                  while (display_element.firstChild) {
                      display_element.removeChild(display_element.firstChild);
                  }
              }
              // create wrapper div, canvas element and image
              var content_wrapper = document.createElement("div");
              content_wrapper.id = "jspsych-image-slider-response-wrapper";
              content_wrapper.style.margin = "100px 0px";
              // create container with slider and labels
              var slider_container = document.createElement("div");
              slider_container.classList.add("jspsych-image-slider-response-container");
              slider_container.style.position = "relative";
              slider_container.style.margin = "0 auto 3em auto";
              if (trial.slider_width !== null) {
                  slider_container.style.width = trial.slider_width.toString() + "px";
              }
              // create html string with slider and labels, and add to slider container
              html =
                  '<input type="range" class="jspsych-slider" value="' +
                      trial.slider_start +
                      '" min="' +
                      trial.min +
                      '" max="' +
                      trial.max +
                      '" step="' +
                      trial.step +
                      '" id="jspsych-image-slider-response-response"></input>';
              html += "<div>";
              for (var j = 0; j < trial.labels.length; j++) {
                  var label_width_perc = 100 / (trial.labels.length - 1);
                  var percent_of_range = j * (100 / (trial.labels.length - 1));
                  var percent_dist_from_center = ((percent_of_range - 50) / 50) * 100;
                  var offset = (percent_dist_from_center * half_thumb_width) / 100;
                  html +=
                      '<div style="border: 1px solid transparent; display: inline-block; position: absolute; ' +
                          "left:calc(" +
                          percent_of_range +
                          "% - (" +
                          label_width_perc +
                          "% / 2) - " +
                          offset +
                          "px); text-align: center; width: " +
                          label_width_perc +
                          '%;">';
                  html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
                  html += "</div>";
              }
              html += "</div>";
              slider_container.innerHTML = html;
              // add canvas and slider to content wrapper div
              content_wrapper.insertBefore(slider_container, canvas.nextElementSibling);
              // add content wrapper div to screen and draw image on canvas
              display_element.insertBefore(content_wrapper, null);
              // add prompt if there is one
              if (trial.prompt !== null) {
                  display_element.insertAdjacentHTML("beforeend", trial.prompt);
              }
              // add submit button
              var submit_btn = document.createElement("button");
              submit_btn.id = "jspsych-image-slider-response-next";
              submit_btn.classList.add("jspsych-btn");
              submit_btn.disabled = trial.require_movement ? true : false;
              submit_btn.innerHTML = trial.button_label;
              display_element.insertBefore(submit_btn, display_element.nextElementSibling);
          }
          else {
              html = '<div id="jspsych-image-slider-response-wrapper" style="margin: 100px 0px;">';
              html += "</div>";
              html +=
                  '<div class="jspsych-image-slider-response-container" style="position:relative; margin: 0 auto 3em auto; width:';
              if (trial.slider_width !== null) {
                  html += trial.slider_width + "px;";
              }
              else {
                  html += "auto;";
              }
              html += '">';
              html +=
                  '<input type="range" class="jspsych-slider" value="' +
                      trial.slider_start +
                      '" min="' +
                      trial.min +
                      '" max="' +
                      trial.max +
                      '" step="' +
                      trial.step +
                      '" id="jspsych-image-slider-response-response"></input>';
              html += "<div>";
              for (var j = 0; j < trial.labels.length; j++) {
                  var label_width_perc = 100 / (trial.labels.length - 1);
                  var percent_of_range = j * (100 / (trial.labels.length - 1));
                  var percent_dist_from_center = ((percent_of_range - 50) / 50) * 100;
                  var offset = (percent_dist_from_center * half_thumb_width) / 100;
                  html +=
                      '<div style="border: 1px solid transparent; display: inline-block; position: absolute; ' +
                          "left:calc(" +
                          percent_of_range +
                          "% - (" +
                          label_width_perc +
                          "% / 2) - " +
                          offset +
                          "px); text-align: center; width: " +
                          label_width_perc +
                          '%;">';
                  html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
                  html += "</div>";
              }
              html += "</div>";
              html += "</div>";
              html += "</div>";
              if (trial.prompt !== null) {
                  html += trial.prompt;
              }
              // add submit button
              html +=
                  '<button id="jspsych-image-slider-response-next" class="jspsych-btn" ' +
                      (trial.require_movement ? "disabled" : "") +
                      ">" +
                      trial.button_label +
                      "</button>";
              display_element.innerHTML = html;
              // set image dimensions after image has loaded (so that we have access to naturalHeight/naturalWidth)
          }
          var response = {
              rt: null,
              response: null,
          };
          if (trial.require_movement) {
              const enable_button = () => {
                  display_element.querySelector("#jspsych-image-slider-response-next").disabled = false;
              };
              display_element
                  .querySelector("#jspsych-image-slider-response-response")
                  .addEventListener("mousedown", enable_button);
              display_element
                  .querySelector("#jspsych-image-slider-response-response")
                  .addEventListener("touchstart", enable_button);
              display_element
                  .querySelector("#jspsych-image-slider-response-response")
                  .addEventListener("change", enable_button);
          }
          const end_trial = () => {
              this.jsPsych.pluginAPI.clearAllTimeouts();
              // save data
              var trialdata = {
                  rt: response.rt,
                  stimulus: trial.stimulus,
                  slider_start: trial.slider_start,
                  response: response.response,
              };
              display_element.innerHTML = "";
              // next trial
              this.jsPsych.finishTrial(trialdata);
          };
          display_element
              .querySelector("#jspsych-image-slider-response-next")
              .addEventListener("click", () => {
              // measure response time
              var endTime = performance.now();
              response.rt = Math.round(endTime - startTime);
              response.response = display_element.querySelector("#jspsych-image-slider-response-response").valueAsNumber;
              if (trial.response_ends_trial) {
                  end_trial();
              }
              else {
                  display_element.querySelector("#jspsych-image-slider-response-next").disabled = true;
              }
          });
          // end trial if trial_duration is set
          if (trial.trial_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(() => {
                  end_trial();
              }, trial.trial_duration);
          }
          var startTime = performance.now();
      }
      simulate(trial, simulation_mode, simulation_options, load_callback) {
          if (simulation_mode == "data-only") {
              load_callback();
              this.simulate_data_only(trial, simulation_options);
          }
          if (simulation_mode == "visual") {
              this.simulate_visual(trial, simulation_options, load_callback);
          }
      }
      create_simulation_data(trial, simulation_options) {
          const default_data = {
              stimulus: trial.stimulus,
              slider_start: trial.slider_start,
              response: this.jsPsych.randomization.randomInt(trial.min, trial.max),
              rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
          };
          const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
          this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
          return data;
      }
      simulate_data_only(trial, simulation_options) {
          const data = this.create_simulation_data(trial, simulation_options);
          this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
          const data = this.create_simulation_data(trial, simulation_options);
          const display_element = this.jsPsych.getDisplayElement();
          this.trial(display_element, trial);
          load_callback();
          if (data.rt !== null) {
              const el = display_element.querySelector("input[type='range']");
              setTimeout(() => {
                  this.jsPsych.pluginAPI.clickTarget(el);
                  el.valueAsNumber = data.response;
              }, data.rt / 2);
              this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("button"), data.rt);
          }
      }
  }
  ImageSliderResponsePlugin.info = info;

  return ImageSliderResponsePlugin;

})(jsPsychModule);
