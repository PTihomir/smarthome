'use strict';
import React, {Component, PropTypes} from 'react';
// import ReactDOM from 'react-dom';

import RecipeList from '../views/recipe/list.js';
import RecipeDetails from '../views/recipe/details.js';

export default class CoreLayout extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedByIndex: -1,
    };
  }

  selectRecipe (index) {
    this.setState({
      selectedByIndex: index,
    });
  }

  unselectRecipe () {
    this.setState({
      selectedByIndex: -1,
    });
  }

  render () {
    if (this.state.selectedByIndex !== -1) {
      let selectedRecipe = this.props.recipes[this.state.selectedByIndex];
      console.log(selectedRecipe);
      return (<RecipeDetails
                data={this.props.recipes[this.state.selectedByIndex]}
                onClose={this.unselectRecipe.bind(this)} />);
    } else {
      return (<RecipeList
                recipes={this.props.recipes}
                onSelection={this.selectRecipe.bind(this)} />);
    }
  }
}

CoreLayout.propTypes = {
  recipes: PropTypes.array.isRequired,
};
