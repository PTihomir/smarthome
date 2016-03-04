'use strict';
import React, {Component, PropTypes} from 'react';
import Icon from '../../components/icons/icon.js';
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
      preparation, icon;

    if (recipe.time.length > 0) {
      preparation = recipe.time
                             .map((time) =>
                                    `${time.type}: ${time.value}m`).join(', ');
      preparation = (<div>{preparation}</div>);
    }

    if (this.props.icon === 0) {
      icon = <Icon set="datatable" name="add" />;
    } else if (this.props.icon === 1) {
      icon = <Icon set="other" name="enquos_basic" />;
    } else {
      icon = <Icon set="default" name="default" />;
    }

    return (
      <div className={classes['recipe-detail']}>
        <h3 className={classes['recipe-detail__title']}> {icon} {recipe.title}</h3>
        {preparation}
        <div>Preparation: {recipe.preparation}</div>

        <Icon set="view_pickers" name="share" />

        <div>Cooking: {recipe.cooking}</div>
        <div><span style={{fontSize: '20px'}}><Icon set="view_pickers" name="share"/> 20px height</span></div>
        <div><span style={{fontSize: '30px'}}><Icon set="view_pickers" name="share" size="md"/> 30px height</span></div>
        <div><span style={{fontSize: '40px'}}><Icon set="view_pickers" name="share" size="lg"/> 40px height</span></div>
        <div><span style={{fontSize: '60px'}}><Icon set="view_pickers" name="share" size="xlg"/> 60px height</span></div>

        <a href="#" onClick={this.props.onClose}>Go back</a>
      </div>
    );
  }
}
