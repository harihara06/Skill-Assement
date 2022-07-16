import React, { Component } from "react";
import ImportMultipleArray from "./Component/ImportMultipleArray";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StyleSheets/Modal.css";
import axios from "axios";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      segmentName: "",
      schemaSelect: [
        {
          name: "Account Name",
          value: "account_name",
        },
        {
          name: "Age",
          value: "age",
        },
        {
          name: "City",
          value: "city",
        },
        {
          name: "First Name",
          value: "first_name",
        },
        {
          name: "Gender",
          value: "gender",
        },

        {
          name: "Last Name",
          value: "last_name",
        },
        {
          name: "State",
          value: "state",
        },
      ],
      importedStateObj: [],
      selectedSegment: {},
      newlyAddedSegment: [],
      segment_0: {},
      segment_1: {},
      segment_2: {},
      segment_3: {},
      segment_4: {},
      segment_5: {},
      segment_6: {},
    };
  }
  componentDidMount() {
    this.setState({
      dummyArrayToSelect: ImportMultipleArray,
    });
  }
  showToast = (type, msg) => {
    return toast[type](msg);
  };
  toggleModal = () => {
    let { modalOpen } = this.state;
    this.setState({
      modalOpen: !modalOpen,
    });
  };
  handleOnInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSchemaOnInputChange = (e, i) => {
    let { newlyAddedSegment } = this.state;
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => {
        newlyAddedSegment[i] = JSON.parse(e.target.value);
        this.setState({
          newlyAddedSegment,
        });
      }
    );
  };
  handleAddSchema = () => {
    let { schemaSelect, selectedSegment } = this.state;
    if (Object.keys(selectedSegment).length === 0) {
      this.showToast("error", "Please select schema to add");
    } else {
      let parsedSegment = JSON.parse(selectedSegment);
      this.setState(
        {
          newlyAddedSegment: [...this.state.newlyAddedSegment, parsedSegment],
        },
        () => this.handleOnChangeAddedSegment(parsedSegment)
      );
      schemaSelect.forEach((select, i) => {
        if (JSON.stringify(select) === JSON.stringify(parsedSegment)) {
          schemaSelect.splice(i, 1);
        }
      });
      this.setState({
        schemaSelect,
        selectedSegment: "",
      });
    }
  };
  handleOnChangeAddedSegment = (parsedSegment) => {
    let { newlyAddedSegment, dummyArrayToSelect } = this.state;
    let indexOfSegment = newlyAddedSegment.indexOf(parsedSegment);
    this.setState(
      {
        [`segment_${indexOfSegment}`]: JSON.stringify(parsedSegment),
      },
      () => {
        for (let i = 0; i < newlyAddedSegment.length; i++) {
          if (dummyArrayToSelect[`dummySelect_${indexOfSegment}`].length > 1) {
            let addedobj = newlyAddedSegment[i];
            dummyArrayToSelect[`dummySelect_${indexOfSegment + 1}`].forEach(
              (select, i) => {
                if (JSON.stringify(select) === JSON.stringify(addedobj)) {
                  dummyArrayToSelect[
                    `dummySelect_${indexOfSegment + 1}`
                  ].splice(i, 1);
                }
              }
            );
          }
          this.setState({
            dummyArrayToSelect,
          });
        }
      }
    );
  };
  handleSaveSegment = () => {
    let { newlyAddedSegment, segmentName, selectedSegment } = this.state;
    if (segmentName === "") {
      this.showToast("error", "Please enter name of the segment");
    } else if (newlyAddedSegment.length === 0) {
      this.showToast("error", "Please select scheme to add");
    } else {
      let tempArray = [];
      newlyAddedSegment.forEach((segment, i) => {
        let dataObj = {};
        dataObj[segment.value] = segment.name;
        tempArray[i] = dataObj;
      });
      let data = {
        segment_name: segmentName,
      };
      data["schema"] = tempArray;
      axios
        .post(
          "https://webhook.site/aea22e70-234e-4df7-945c-ea2f34a97c4f",
          data,
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  render() {
    let {
      modalOpen,
      segmentName,
      schemaSelect,
      selectedSegment,
      newlyAddedSegment,
    } = this.state;
    return (
      <div className="container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <button className="btn btn-segment" onClick={() => this.toggleModal()}>
          Save Segment
        </button>
        <div className="modal-container">
          <div
            className={modalOpen ? "opac-modal" : "modal-false"}
            onClick={() => this.toggleModal()}
          ></div>
          <div className={modalOpen ? "display-modal" : "hide-modal"}>
            <div className={modalOpen ? "modal-datae" : "modal-false"}>
              <header className="nav-content">
                <div className="flex-nav">
                  <i className="fas fa-less-than"></i>
                  <label className="label-segment">Save Segment</label>
                </div>
              </header>
              <div className="modal-body">
                <div className="segment-input">
                  <label>Enter the Name of the Segment</label>
                  <input
                    name="segmentName"
                    value={segmentName}
                    placeholder="Name of the Segment"
                    onChange={(e) => this.handleOnInputChange(e)}
                  />
                </div>
                <p className="segment-info">
                  To save your segment, you need to add the schemas <br /> to
                  build query
                </p>
                <div className="traits-content">
                  <div className="flex-wrap">
                    <div className="radius-circle"></div>
                    <div>- Group Trait</div>
                  </div>
                  <div className="flex-wrap">
                    <div className="radius-circle"></div>
                    <div>- User Traits</div>
                  </div>
                </div>
                {newlyAddedSegment.length > 0 &&
                  newlyAddedSegment.map((segment, i) => (
                    <div key={i}>
                      <div className="added-segment-flex">
                        <div className="segment-radius"></div>
                        <select
                          className="schema-dropdown"
                          value={this.state[`segment_${i}`]}
                          name={`segment_${i}`}
                          onChange={(e) => this.handleSchemaOnInputChange(e, i)}
                        >
                          {this.state.dummyArrayToSelect[
                            `dummySelect_${i}`
                          ].map((schema, i) => (
                            <option
                              key={i}
                              value={JSON.stringify({
                                name: schema.name,
                                value: schema.value,
                              })}
                            >
                              {schema.name}
                            </option>
                          ))}
                        </select>
                        <div className="hyphen-content">
                          <div></div>
                        </div>
                      </div>
                    </div>
                  ))}
                <div className="add-segment-flex">
                  <div className="segment-radius"></div>
                  {schemaSelect.length === 0 ? (
                    <>
                      <div className="added-schema">
                        {" "}
                        All Schema has been Added
                      </div>
                    </>
                  ) : (
                    <select
                      className="schema-dropdown"
                      value={selectedSegment}
                      name="selectedSegment"
                      onChange={(e) => this.handleOnInputChange(e)}
                    >
                      <option value="">Add Segment to Schema</option>
                      {schemaSelect.map((schema, i) => (
                        <option
                          key={i}
                          value={JSON.stringify({
                            name: schema.name,
                            value: schema.value,
                          })}
                        >
                          {schema.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="hyphen-content">
                    <div></div>
                  </div>
                </div>
                <div
                  onClick={() => this.handleAddSchema()}
                  className="schema-link"
                >
                  {" "}
                  <label>+</label>
                  <div className="text-link"> Add Scheme</div>
                </div>
              </div>
            </div>
            <div className={modalOpen ? "footer-content" : "modal-false"}>
              <button
                className="save-btn"
                onClick={() => this.handleSaveSegment()}
              >
                Save the Segment
              </button>
              <button className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
