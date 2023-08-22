import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
import './MedicalFacility.scss'

class MedicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : []
            })
        }
    }

    handleViewInfoClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/info-clinic/${clinic.id}`)
        }
    }

    render() {
        let { dataClinics } = this.state
        return (
            <div className='section-share section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="homepage.medical-facilities" /></span>
                        <button className='btn-section'><FormattedMessage id="homepage.more-info" /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataClinics && dataClinics.length > 0 &&
                                dataClinics.map((item, index) => {
                                    return (
                                        <div className='section-customize clinic-child' key={index}
                                            onClick={() => this.handleViewInfoClinic(item)}
                                        >
                                            <div className='bg-image section-medical-facility'
                                                style={{
                                                    backgroundImage: `url(${item.image})`,
                                                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                            <div className='clinic-name'>{item.name}</div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>

                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
