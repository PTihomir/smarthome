'use strict';
import React, {Component, PropTypes} from 'react';
import Icon from '../../components/icons/icon.js';
import styles from './list.scss';

export default class RecipeList extends Component {
  static propTypes = {
    recipes: PropTypes.array.isRequired,
    onSelection: PropTypes.func.isRequired,
    theme: PropTypes.object,
  };

  onSelect (e) {
    this.props.onSelection(parseInt(e.currentTarget.attributes['data-id'].value, 10));
  }

  render () {
    // console.log('Styles: ', styles);
    return (
      <ul className={styles['recipe-list']}>
        {
          this.props.recipes.map((recipe, idx) =>
            <li key={idx} data-id={idx} onClick={this.onSelect.bind(this)}>
              <Icon set="datatable" name="default" />
            {recipe.title}
            </li>)
        }
      </ul>
    );
  }
}
