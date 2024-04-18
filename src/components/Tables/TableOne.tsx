import { Absence } from '../../types/Absence';
import BrandOne from '../../images/brand/brand-01.svg';
import BrandTwo from '../../images/brand/brand-02.svg';
import BrandThree from '../../images/brand/brand-03.svg';
import BrandFour from '../../images/brand/brand-04.svg';
import BrandFive from '../../images/brand/brand-05.svg';
import RemindIcon from '@rsuite/icons/legacy/Remind';
import userThree from '../../images/user/user-03.png';
import moment from 'moment';
import { AiFillPhone, AiOutlineSecurityScan } from 'react-icons/ai';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAppContext } from '../../AppContext';
import API from '../../api';

import * as Yup from 'yup';

import {
  DatePicker,
  Modal,
  ButtonToolbar,
  Button,
  Loader,
  Placeholder,
} from 'rsuite';
import { useState, useEffect } from 'react';
import { BRAND } from '../../types/brand';
import { toast } from 'react-toastify';

interface FormValues {
  userName: string;
  email: string;
  password: string;
  file: File | null;
  phoneNumber: string;
  position: string;
}

// Set to the first day of the current month
const setToFirstDayOfMonth = () => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  return firstDayOfMonth;
};

// Set to the last day of the current month
const setToLastDayOfMonth = () => {
  const currentDate = new Date();
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  return lastDayOfMonth;
};

const TableOne = () => {
  const [data, setData] = useState<Absence[]>([]);
  const [datePick, setDatePick] = useState<Date>(setToFirstDayOfMonth());
  const [toDate, setToDate] = useState<Date>(setToLastDayOfMonth());

  const retrieveSummary = async () => {
    const respRetrieveAbsence = await API.post(
      'ABSENCE',
      `retrieve-all-absences`,
      {
        dateFrom: moment(datePick).format('MM-DD-YYYY'),
        dateTo: moment(toDate).format('MM-DD-YYYY'),
      },
    );
    if (respRetrieveAbsence.status === 'Bad Request') {
      toast.error(respRetrieveAbsence.message, {
        position: 'top-right',
      });
    } else {
      setData(respRetrieveAbsence.data);
    }
  };

  useEffect(() => {
    retrieveSummary();
  }, [datePick, toDate]);

  const changeDate = (date: any) => {
    setDatePick(date);
  };
  const changeToDate = (date: any) => {
    setToDate(date);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div>
          <label>From : </label>
          <DatePicker
            format="dd/MM/yyyy"
            onSelect={(e) => changeDate(e)}
            onChange={(e) => changeDate(e)}
            placeholder="From:"
            value={datePick}
          />
        </div>

        <div>
          <label>To : </label>
          <DatePicker
            format="dd/MM/yyyy"
            onSelect={(e) => changeToDate(e)}
            onChange={(e) => changeToDate(e)}
            placeholder="From:"
            value={toDate}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">
              Position
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">
              Date
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">
              Clocked In
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">
              Clocked Out
            </h5>
          </div>
        </div>

        {data.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === data.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <img
                  src={
                    brand.photo
                      ? `http://localhost:3030/uploads/${brand.photo}`
                      : userThree
                  }
                  alt="Brand"
                  width={'60px'}
                />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {brand.username}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{brand.position}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {moment(brand.date_absence).format('DD/MM/YYYY')}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{brand.clocked_in}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{brand.clocked_out}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
