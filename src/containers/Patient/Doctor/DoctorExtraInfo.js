import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfo.scss';

import { languages } from '../../../utils';
import { getExtraInfoDoctorById } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfo: {}
        }
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }



    async componentDidUpdate(prevProps, prevState) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }

    showHideDetailInfo = (status) => {
        this.setState({
            isShowDetailInfo: status
        })
    }

    render() {
        let { language } = this.props
        let { isShowDetailInfo, extraInfo } = this.state
        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'><FormattedMessage id='patient.extra-info-doctor.text-address' /></div>
                    <div className='name-clinic'>
                        {extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfo && extraInfo.addressClinic ? extraInfo.addressClinic : ''}
                    </div>
                </div>
                <div className='content-down'>

                    {isShowDetailInfo === false &&
                        <div className='short-info'><FormattedMessage id='patient.extra-info-doctor.price-uppercase' />
                            {extraInfo && extraInfo.priceTypeData && language === languages.VI &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfo.priceTypeData.valueVi}
                                    displayType='text'
                                    thousandSeparator={true}
                                    suffix='VND'
                                />

                            }
                            {extraInfo && extraInfo.priceTypeData && language === languages.EN &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfo.priceTypeData.valueEn}
                                    displayType='text'
                                    thousandSeparator={true}
                                    suffix='$'
                                />

                            }
                            <span className='detail' onClick={() => this.showHideDetailInfo(true)}>
                                <FormattedMessage id='patient.extra-info-doctor.see-detail' />
                            </span>
                        </div>
                    }
                    {isShowDetailInfo === true &&
                        <>
                            <div className='title-price'><FormattedMessage id='patient.extra-info-doctor.price-uppercase' /></div>
                            <div className='detail-info'>
                                <div className='price'>
                                    <span className='left'><FormattedMessage id='patient.extra-info-doctor.price' /></span>
                                    <span className='right'>
                                        {extraInfo && extraInfo.priceTypeData && language === languages.VI &&
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfo.priceTypeData.valueVi}
                                                displayType='text'
                                                thousandSeparator={true}
                                                suffix='VND'
                                            />

                                        }
                                        {extraInfo && extraInfo.priceTypeData && language === languages.EN &&
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfo.priceTypeData.valueEn}
                                                displayType='text'
                                                thousandSeparator={true}
                                                suffix='$'
                                            />

                                        }
                                    </span>
                                </div>

                                <div className='note'>
                                    {extraInfo && extraInfo.note ? extraInfo.note : ''}
                                </div>
                            </div>

                            <div className='payment'><FormattedMessage id='patient.extra-info-doctor.text' />
                                {extraInfo && extraInfo.paymentTypeData && language === languages.VI ? extraInfo.paymentTypeData.valueVi : ''}
                                {extraInfo && extraInfo.paymentTypeData && language === languages.EN ? extraInfo.paymentTypeData.valueEn : ''}
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showHideDetailInfo(false)}>
                                    <FormattedMessage id='patient.extra-info-doctor.hide' />
                                </span>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
