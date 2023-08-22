import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


class About extends Component {

    render() {

        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>Truyền thông nói về BookingCare</div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400px" src="https://www.youtube.com/embed/gCrmFbgT37I"
                            title="How does alcohol make you drunk? - Judy Grisel"
                            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen></iframe>
                    </div>
                    <div className='content-right'>
                        <p>Follow alcohol on its journey through the body to find out how it causes drunkenness and why it affects people differently.


                        </p>
                        <p>--

                            Ethanol: this molecule, made of little more than a few carbon atoms, is responsible for drunkenness. Often simply referred to as alcohol, ethanol is the active ingredient in alcoholic beverages. So how exactly does it cause drunkenness, and why does it have dramatically different effects on different people? Judy Grisel explores alcohol's journey through the body.
                        </p>
                        <p>Lesson by Judy Grisel, directed by Anton Bogaty.</p>
                    </div>
                </div>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
