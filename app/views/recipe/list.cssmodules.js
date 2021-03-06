'use strict';
import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import styles from './list.scss';

// @CSSModules(styles)
export default class RecipeList extends Component {
  static propTypes = {
    recipes: PropTypes.array.isRequired,
    onSelection: PropTypes.func.isRequired,
    theme: PropTypes.object,
  };

  onSelect (e) {
    this.props.onSelection(parseInt(e.target.attributes['data-id'].value, 10));
  }

  render () {
    // console.log('Styles: ', styles);
    return (
      <ul styleName="recipe-list">
        {
          this.props.recipes.map((recipe, idx) =>
            <li key={idx} data-id={idx} onClick={this.onSelect.bind(this)}>{recipe.title}</li>)
        }
      </ul>
    );
  }
}

export default CSSModules(RecipeList, styles);
