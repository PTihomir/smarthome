'use strict';
import React, {Component, PropTypes} from 'react';
import classes from './details.scss';
// var value = require('./addition.js');

export default class RecipeDetails extends Component {
  static propTypes = {
    // data: PropTypes.shape({
    //   title: PropTypes.string,
    //   time: PropTypes.array,
    // }),
    onClose: PropTypes.func,
    data: PropTypes.object.isRequired,
  };

  render () {
    console.log(classes);
    let recipe = this.props.data,
      preparation;

    if (recipe.time.length > 0) {
      preparation = recipe.time
                             .map((time) =>
                                    `${time.type}: ${time.value}m`).join(', ');
      preparation = (<div>{preparation}</div>);
    }

    return (
      <div className={classes['recipe-detail']}>
        <h3 className={classes['recipe-detail__title']}>{recipe.title}</h3>
        {preparation}
        <div>Preparation: {recipe.preparation}</div>
        <div>Cooking: {recipe.cooking}</div>
        <a href="#" onClick={this.props.onClose}>Go back</a>
      </div>
    );
  }
}
