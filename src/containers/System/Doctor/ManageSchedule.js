import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { crudAction, languages, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDoctors: [],
            selectedOption: {},
            currentDate: '',
            rangeTime: []
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.doctors !== this.props.doctors) {
            let dataSelect = this.buildDataInputSelect(this.props.doctors)
            this.setState({
                allDoctors: dataSelect
            })
        }
        if (prevProps.times !== this.props.times) {
            let data = this.props.times;
            if (data && data.length > 0) {
                data = data.map(item => ({
                    ...item, isSelected: false
                }))
            }
            this.setState({
                rangeTime: data
            })
        }
        // if (prevProps.language !== this.props.language) {
        //     let dataSelect = this.buildDataInputSelect(this.props.doctors)
        //     this.setState({
        //         allDoctors: dataSelect
        //     })
        // }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === languages.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object)
            })

        }
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({
            selectedOption: selectedOption
        });

    }

    handleOnChangDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let result = [];
        let { rangeTime, selectedOption, currentDate } = this.state;
        if (!currentDate) {
            toast.error('Invalid date!')
            return;
        }
        if (selectedOption && _.isEmpty(selectedOption)) {
            toast.error('Invalid selected doctor!')
            return;
        }
        let formattedDate = new Date(currentDate).getTime()
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true)
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(time => {
                    let obj = {};
                    obj.doctorId = selectedOption.value
                    obj.date = formattedDate
                    obj.timeType = time.keyMap
                    result.push(obj)
                })

            } else {
                toast.error('invalid selected time!')
                return;
            }
        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedOption.value,
            formattedDate: formattedDate
        });
        if (res && res.errCode === 0) {
            toast.success('Save succeed!')
        } else {
            toast.error('save failed!')
            console.log(res)
        }
    }

    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        return (
            <div className='manage-schedule-container'>
                <div className='manage-schedule-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6'>
                            <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChangeSelect}
                                options={this.state.allDoctors}
                            />
                        </div>
                        <div className='col-6'>
                            <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                            <DatePicker
                                onChange={this.handleOnChangDatePicker}
                                className='form-control'
                                value={this.state.currentDate}
                                minDate={new Date().setHours(0, 0, 0, 0)}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >{
                                                language === languages.VI ? item.valueVi : item.valueEn
                                            }</button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary btn-schedule-save'
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        doctors: state.admin.doctors,
        language: state.app.language,
        times: state.admin.times
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
