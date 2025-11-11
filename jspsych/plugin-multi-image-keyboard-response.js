var jsPsychMultiImageKeyboardResponse = (function (jspsych) {
  'use strict';

  const info = {
      name: "multi-image-keyboard-response",
      parameters: {
          /** The image to be displayed */
          stimuli: {
              type: jspsych.ParameterType.IMAGE,
              pretty_name: "Stimuli",
              default: undefined,
              array: true,
          },
          /** Set the image height in pixels */
          stimuli_heights: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Image heights",
              default: null,
              array: true,
          },
          /** Set the image width in pixels */
          stimuli_widths: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Image widths",
              default: null,
              array: true,
          },
          stimuli_locations: {
            type: jspsych.ParameterType.INT,
            pretty_name: "Stimuli locations",
            default: [12, 6],
            array: true,
          },
          stimuli_radii: {
            type: jspsych.ParameterType.INT,
            pretty_name: "Stimuli radii",
            default: [300],
            array: true,
          },          /** Maintain the aspect ratio after setting width or height */
          maintain_aspect_ratio: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Maintain aspect ratio",
              default: true,
          },
          /** Array containing the key(s) the subject is allowed to press to respond to the stimulus. */
          choices: {
              type: jspsych.ParameterType.KEYS,
              pretty_name: "Choices",
              default: "ALL_KEYS",
          },
          /** Any content here will be displayed below the stimulus. */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Prompt",
              default: null,
          },
          /** How long to show the stimulus. */
          stimuli_durations: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Stimuli durations",
              default: null,
              array: true,
          },
          /** How long to show trial before it ends */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
          /** If true, trial will end when subject makes a response. */
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
          canvas_bg: {
            type: jspsych.ParameterType.INT,
            pretty_name: "Canvas BG greyscale",
            default: 169,
          },
      },
  };
  /**
   * **multi-image-keyboard-response**
   *
   * jsPsych plugin for displaying multiple image stimuli and getting a keyboard response
   *
   * @author Cameron Phan (adapted from Josh de Leeuw)
   * @see {@link https://www.jspsych.org/plugins/jspsych-image-keyboard-response/ image-keyboard-response plugin documentation on jspsych.org}
   */
  class MultiImageKeyboardResponsePlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          var height, width;
          var xcoord, ycoord;
          var screen_dims = [window.innerHeight/2, window.innerWidth/2];
          if (trial.render_on_canvas) {
              var image_drawn = false;
              // first clear the display element (because the render_on_canvas method appends to display_element instead of overwriting it with .innerHTML)
              if (display_element.hasChildNodes()) {
                  // can't loop through child list because the list will be modified by .removeChild()
                  while (display_element.firstChild) {
                      display_element.removeChild(display_element.firstChild);
                  }
              }
              // create canvas element and image
              var canvas = document.createElement("canvas");
              canvas.id = "jspsych-multi-image-keyboard-response-stimuli";
              canvas.style.margin = "0";
              canvas.style.padding = "0";
              canvas.height = window.innerHeight;
              canvas.width = window.innerWidth;
              var ctx = canvas.getContext("2d");
              ctx.fillStyle = "rgb(" + trial.canvas_bg + "," + trial.canvas_bg + "," + trial.canvas_bg + ")";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              var img = new Array()
              for (let e=0; e < trial.stimuli.length; e++)
                {
                img[e] = new Image();
                img[e].onload = () => {
                // if image wasn't preloaded, then it will need to be drawn whenever it finishes loading
                    // if (!image_drawn) {
                        getHeightWidth(); // only possible to get width/height after image loads
                        getXYCoords();
                        var xpix = Math.floor(canvas.width/2) + xcoord - Math.floor(width/2);
                        var ypix = Math.floor(canvas.height/2) - ycoord - Math.floor(height/2);
                        ctx.drawImage(img[e], xpix, ypix, width, height);
                    // }
                };
                
                img[e].src = trial.stimuli[e];  

                const getXYCoords = () => {
                    if (trial.stimuli_radii.length == 1 && trial.stimuli.length > 1) {
                        xcoord = Math.floor(trial.stimuli_radii[0] * Math.cos(Math.PI/2 - (trial.stimuli_locations[e]*Math.PI/6)));
                        ycoord = Math.floor(- trial.stimuli_radii[0] * Math.sin(Math.PI/2 - (trial.stimuli_locations[e]*Math.PI/6)));
                    }
                    else
                    {
                        xcoord = Math.floor(trial.stimuli_radii[e] * Math.cos(Math.PI/2 - (trial.stimuli_locations[e]*Math.PI/6)));
                        ycoord = Math.floor(- trial.stimuli_radii[e] * Math.sin(Math.PI/2 - (trial.stimuli_locations[e]*Math.PI/6)));
                    }
                }

                const getHeightWidth = () => {
                    if (trial.stimuli_heights !== null) {
                        if (trial.stimuli_heights.length == 1)
                        {
                            height = trial.stimuli_heights[0];
                        }
                        else
                        {
                            height = trial.stimuli_heights[e];
                        }
                        if (trial.stimuli_widths == null && trial.maintain_aspect_ratio) {
                            width = img[e].naturalWidth * (height / img[e].naturalHeight);
                        }
                    }
                    else {
                        height = img[e].naturalHeight;
                    }
                    if (trial.stimuli_widths !== null) {
                        if (trial.stimuli_widths.length == 1)
                        {
                            width = trial.stimuli_widths[0];
                        }
                        else
                        {
                            width = trial.stimuli_widths[e];
                        }
                        if (trial.stimuli_heights == null && trial.maintain_aspect_ratio) {
                            height = img[e].naturalHeight * (width / img[e].naturalWidth);
                        }
                    }
                    else if (!(trial.stimuli_heights !== null && trial.maintain_aspect_ratio)) {
                        // if stimulus width is null, only use the image's natural width if the width value wasn't set
                        // in the if statement above, based on a specified height and maintain_aspect_ratio = true
                        width = img[e].naturalWidth;
                    }
                };
                getHeightWidth(); // call now, in case image loads immediately (is cached)
                getXYCoords();
                var xpix = Math.floor(canvas.width/2) + xcoord - Math.floor(width/2);
                var ypix = Math.floor(canvas.height/2) - ycoord - Math.floor(height/2);
                // add canvas and draw image
                display_element.insertBefore(canvas, null);
                if (img[e].complete && Number.isFinite(width) && Number.isFinite(height)) {
                    // if image has loaded and width/height have been set, then draw it now
                    // (don't rely on img onload function to draw image when image is in the cache, because that causes a delay in the image presentation)
                    ctx.drawImage(img[e], xpix, ypix, width, height);
                    image_drawn = true;
                }

                }                
                if (trial.prompt !== null) {
                    display_element.insertAdjacentHTML("beforeend", trial.prompt);
                }
                canvas.height = trial.stimuli_heights[0];
                canvas.width = 512+256;

              // get/set image height and width - this can only be done after image loads because uses image's naturalWidth/naturalHeight properties
          }
          // store response
          var response = {
              rt: null,
              key: null,
          };
          // function to end trial when it is time
          const end_trial = () => {
              // kill any remaining setTimeout handlers
              this.jsPsych.pluginAPI.clearAllTimeouts();
              // kill keyboard listeners
              if (typeof keyboardListener !== "undefined") {
                  this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
              }
              // gather the data to store for the trial
              var trial_data = {
                  rt: response.rt,
                  stimuli: trial.stimuli,
                  response: response.key,
              };
              // clear the display
              display_element.innerHTML = "";
              // move on to the next trial
              this.jsPsych.finishTrial(trial_data);
          };
          // function to handle responses by the subject
          var after_response = (info) => {
              // after a valid response, the stimulus will have the CSS class 'responded'
              // which can be used to provide visual feedback that a response was recorded
              for (let i = 0; i < trial.stimuli.length; i++) {
                 display_element.querySelector("#jspsych-multi-image-keyboard-response-stimuli").className +=
                  " responded"; 
              }
              // only record the first response
              if (response.key == null) {
                  response = info;
              }
              if (trial.response_ends_trial) {
                  end_trial();
              }
          };
          // start the response listener
          if (trial.choices != "NO_KEYS") {
              var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                  callback_function: after_response,
                  valid_responses: trial.choices,
                  rt_method: "performance",
                  persist: false,
                  allow_held_key: false,
              });
          }
          // hide stimulus if stimulus_duration is set
          if (trial.stimuli_durations !== null) {
            for (let i = 0; i < trial.stimuli.length; i++)
            {
              this.jsPsych.pluginAPI.setTimeout(() => {
                  display_element.querySelector("#jspsych-multi-image-keyboard-response-stimuli").style.visibility = "hidden";
              }, trial.stimuli_durations[i]);
            }
          }
          // end trial if trial_duration is set
          if (trial.trial_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(() => {
                  end_trial();
              }, trial.trial_duration);
          }
          else if (trial.response_ends_trial === false) {
              console.warn("The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true.");
          }
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
              this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
          }
      }
      create_simulation_data(trial, simulation_options) {
          const default_data = {
              stimuli: trial.stimuli,
              rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
              response: this.jsPsych.pluginAPI.getValidKey(trial.choices),
          };
          const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
          this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
          return data;
      }
  }
  MultiImageKeyboardResponsePlugin.info = info;

  return MultiImageKeyboardResponsePlugin;

})(jsPsychModule);
