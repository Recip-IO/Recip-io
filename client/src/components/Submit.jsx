import React from "react";
import $ from "jquery";

var textStyle = { width: "96%" }

class Submit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      sourceDisplayName: this.props.username,
      ingredients: [],
      recipeName: '',
      totalTimeInSeconds: 0,
      description: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitRecipe = this.submitRecipe.bind(this);
  }

  handleChange(event) {
    let change = { [event.target.name] : event.target.value };
    this.setState(change);
  }

  submitRecipe(event) {
    event.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/recipios',
      data: JSON.stringify(this.state),
      contentType: 'application/json'
    })
      .done(function(data) {
        console.log('submit component posted successfully', data);
      })
      .fail(function() {
        console.log('submit component failed to post');
    });
  }



  render() {
    return (
      <div>
        <div className="search-submit-header">Add a recipe of your own</div>
        <form method="POST" onSubmit={this.submitRecipe}>
          <input type="text" placeholder="Give your recipe a title" id="newRecipeName" name="recipeName" value={this.state.recipeName} onChange={this.handleChange}></input>
          <input type="submit" value="Add"></input>
          <textarea rows="12" placeholder="Enter a description – this can include quantites of ingredients, steps to create or even pairing recommendations!"  id="newRecipeDescription" name="description" value={this.state.description} onChange={this.handleChange}></textarea>
          <input type="text" style={textStyle} placeholder="Add a shopping list for your ingredients (seperate each item with a comma)" id="newRecipeIngredients" name="ingredients" value={this.state.ingredients} onChange={this.handleChange}></input>
          <input type="text" style={textStyle} placeholder="Add an image url (optional)" id="newRecipeImageUrl" name="imageUrl" value={this.state.imageUrl} onChange={this.handleChange}></input>
          <input type="text" style={textStyle} placeholder="Author or source" id="newRecipesourceDisplayName" name="sourceDisplayName" value={this.state.sourceDisplayName} onChange={this.handleChange}></input>
        </form>
      </div>
    );
  }
}

export default Submit;