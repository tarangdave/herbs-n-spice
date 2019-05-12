import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      ingInput: "",
      ingredient: "",
      tags: "",
      addIngredient: "",
      addText: "",
      addTags: ""
    };
    this.ingSearchInput = this.ingSearchInput.bind(this)
    this.submitIngData = this.submitIngData.bind(this)
    this.changeAddIng = this.changeAddIng.bind(this)
    this.changeAddText = this.changeAddText.bind(this)
    this.changeAddTags = this.changeAddTags.bind(this)
  }

  updateData(self, ingInput) {
    axios.get('http://localhost:3000/fuzzy-search/'+ingInput)
      .then(function (response) {
        // handle success
        console.log(response);
        var tagStr = ""
        for (let [key, value] of Object.entries(response.data.value.tags)) {
          tagStr += ""+key+", "
          console.log(tagStr);
        }
        self.setState({ingredient: response.data.value.text, tags: tagStr.slice(0,-2)})
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

  ingSearchInput(event) {
    const ingInput = event.target.value;
    this.setState({ingInput})

    this.updateData(this, ingInput)
        
  }

  changeAddIng(event) {
    const addIngredient = event.target.value;
    this.setState({addIngredient})

        
  }

  changeAddText(event) {
    const addText = event.target.value;
    this.setState({addText})

        
  }

  changeAddTags(event) {
    const addTags = event.target.value;
    this.setState({addTags})

        
  }

  submitIngData() {
    var array = this.state.addTags.replace(/ /g,'').split(',');
    var ingObj = this.state.addIngredient;
    var textObj = this.state.addText;
    var tagObj = {}
    for(var i=0;i<array.length;i++){
      tagObj[array[i].toUpperCase()] = 1
    }
    console.log(tagObj)
    axios.post('http://localhost:3000/new-ingredient', {
      ingredient: ingObj,
      text: textObj,
      tags: tagObj
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    this.setState({addIngredient: "", addText: "", addTags: ""})
  
  }

  render() {
    return (
      <div className="App">
        <div>
          <input type="text" value={this.state.ingInput} onChange={this.ingSearchInput}></input>
          <div>Ingredient: <span>{this.state.ingredient}</span></div>
          <div>Tags: <span>{this.state.tags}</span></div>
        </div>
        <div>
          Ingredient<input type="text" value={this.state.addIngredient} onChange={this.changeAddIng}></input>
          Text Description<input type="text" value={this.state.addText} onChange={this.changeAddText}></input>
          Tags(comma separated)<input type="text" value={this.state.addTags} onChange={this.changeAddTags}></input>
          <button type="button" onClick={this.submitIngData}>Submit</button>
        </div>
      </div>
    );
  }
}

export default App;
