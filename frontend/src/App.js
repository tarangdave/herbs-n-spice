import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingInput: '',
      ingredient: '',
      tags: '',
      addIngredient: '',
      addText: '',
      addTags: '',
    };
    this.ingSearchInput = this.ingSearchInput.bind(this);
    this.submitIngData = this.submitIngData.bind(this);
    this.changeAddIng = this.changeAddIng.bind(this);
    this.changeAddText = this.changeAddText.bind(this);
    this.changeAddTags = this.changeAddTags.bind(this);
  }

  /**
   * This is a function to make axios call to rest endpoint.
   *
   * @param {window} self - A this param
   * @param {string} ingInput - A search param
   *
   * @example
   *
   *     updateData(this, 'eggo')
   */
  updateData(self, ingInput) {
    axios.get(`http://localhost:3000/fuzzy-search/${ingInput}`)
        .then((response) => {
        // handle success
        let tagStr = ''
        for (let [key, value] of Object.entries(response.data.value.tags)) {
          tagStr += '' + key + ', ' // iterate over the tag object from response and store as comma separated string
        }
        self.setState({ingredient: response.data.value.text, tags: tagStr.slice(0,-2)}); // slice the space and extra comma from end
      })
        .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  ingSearchInput(event) {
    const ingInput = event.target.value;
    this.setState({ ingInput });

    // call update data to fetch ingredients from endpoint
    this.updateData(this, ingInput);
  }

  changeAddIng(event) {
    const addIngredient = event.target.value;
    this.setState({ addIngredient });
  }

  changeAddText(event) {
    const addText = event.target.value;
    this.setState({ addText });
  }

  changeAddTags(event) {
    const addTags = event.target.value;
    this.setState({ addTags });
  }


  /**
   * This is a function to make axios call on submit click
   * Adds a new ingredient to the dynamodb database
   *
   */
  submitIngData() {
    let array = this.state.addTags.replace(/ /g, '').split(','); // remove all whitespace and split based on comma
    let ingObj = this.state.addIngredient;
    let textObj = this.state.addText;
    let tagObj = {};
    for (let i = 0; i < array.length; i++) {
      tagObj[array[i].toUpperCase()] = 1; // iterate over array and create a tag object, assigning each key the value 1
    }
    axios.post('http://localhost:3000/new-ingredient', {
      ingredient: ingObj,
      text: textObj,
      tags: tagObj,
    })
        .then((response) => {
    })
        .catch((error) => {
      console.log(error);
    });
    this.setState({ addIngredient: '', addText: '', addTags: '' });
  }

  render() {
    return (
      <div>
        <div className="navbar">
          <div className="text-color">Welcome to herbs-n-spice</div>
        </div>
        <div className="App">
          <div>
            <input type="text" value={this.state.ingInput} onChange={this.ingSearchInput} placeholder="Type ingredient name..." />
            <div className="my-list">
              <div>
                <b className="text-color">Ingredient:</b> 
                <span>{this.state.ingredient}</span>
              </div>
              <div>
                <b className="text-color">Tags:</b> 
                <span>{this.state.tags}</span>
              </div>
            </div>
          </div>
          <div>
            <input type="text" value={this.state.addIngredient} onChange={this.changeAddIng} placeholder="Add Ingredient name..." required /><br/>
            <input type="text" value={this.state.addText} onChange={this.changeAddText} placeholder="Add a text description" required /><br/>
            <input type="text" value={this.state.addTags} onChange={this.changeAddTags} placeholder="Add tags (comma separated)" required /><br/>
            <button type="submit" className="base-color" onClick={this.submitIngData}>Submit</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
