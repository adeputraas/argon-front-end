import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { Calendar, Whisper, Popover, Badge } from 'rsuite';
import '../css/style.css';
import '../css/calendar.css';
import { AiFillClockCircle } from 'react-icons/ai';
import API from '../api';
import moment from 'moment';

import { toast } from 'react-toastify';

type Activity = {
  id: string;
  time: string;
  title: string;
  date_absence: string;
};

type ActivityChild = {
  id: string;
  users_id: string;
  clocked_in: string;
  clocked_out: string;
  date_absence: string;
  time: string;
  title: string;
  status: boolean;
};

type Act = {
  time: string;
  title: string;
};

interface User {
  username: string;
  role: string;
  idUser: string;
  email: string;
  photo: string;
}

const detailUserString = localStorage.getItem('user') || '';

const CalendarComp = () => {
  const [isClocked, setClockedIn] = useState(false);
  const [activities, setActivity] = useState<Activity[]>([]);
  const [userDetail, setUserDetail] = useState<User>(
    JSON.parse(detailUserString),
  );

  useEffect(() => {
    retrieveDataAbsenceUser();
  }, [isClocked]);

  const formatAMPM = (date: any) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  };

  const retrieveDataAbsenceUser = async () => {
    const respRetrieveUser = await API.post(
      'ABSENCE',
      `retrieve-absences-users`,
      { month: (moment().month() + 1).toString()}
    );
    if (respRetrieveUser.status === 'Bad Request') {
      toast.error(respRetrieveUser.message, {
        position: 'top-right',
      });
    } else {
      let activity: Activity[] = [];
      let data = respRetrieveUser.data;
      data.forEach((val: ActivityChild) => {
        if (val.clocked_in != '' && val.clocked_out != '') {
          activity.push({
            id: val.id,
            date_absence: val.date_absence,
            time: val.clocked_in,
            title: 'Clocked In',
          });
          activity.push({
            id: val.id,
            date_absence: val.date_absence,
            time: val.clocked_out,
            title: 'Clocked Out',
          });
        } else if (val.clocked_in != '') {
          activity.push({
            id: val.id,
            date_absence: val.date_absence,
            time: val.clocked_in,
            title: 'Clocked In',
          });
        }
      });

      setActivity(activity);
    }
  };

  const getTodoList = (date: any) => {
    // console.log(activities,'???')
    const selectedDate = new Date(date).getDate();
    const filteredActivities = [...activities].filter((activity: Activity) => {
      const activityDate = new Date(activity.date_absence).getDate();
      return activityDate === selectedDate;
    });

    const act: Act[] = filteredActivities.map((activity: Activity) => ({
      time: activity.time,
      title: activity.title,
    }));

    return act;
  };

  const renderCell = (date: any) => {
    const list = getTodoList(date);
    const displayList = list.filter((item, index) => index < 2);
    if (list.length) {
      const moreCount = list.length - displayList.length;
      const moreItem = (
        <li>
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                {list.map((item, index) => (
                  <p key={index}>
                    <b>{item.time}</b> - {item.title}
                  </p>
                ))}
              </Popover>
            }
          >
            <a>{moreCount} more</a>
          </Whisper>
        </li>
      );

      return (
        <ul className="calendar-todo-list">
          {displayList.map((item, index) => (
            <li key={index}>
              <Badge /> <b>{item.time}</b> - {item.title}
            </li>
          ))}
          {moreCount ? moreItem : null}
        </ul>
      );
    }

    return null;
  };

  const isClockedIn = async () => {
    const day = new Date().getDate();
    const month = new Date().getMonth();
    const object = {
      id: day + month,
      time: formatAMPM(new Date()),
      title: isClocked ? 'Clocked Out' : 'Clocked In',
    };
    if (!isClocked) {
      const dtoAbsence = {
        clocked_in: formatAMPM(new Date()),
        date: moment().format('MM-DD-YYYY'),
        status: 'Clocked In',
      };
      const responseClockedIn = await API.post(
        'ABSENCE',
        'update-status-clocked',
        dtoAbsence,
      );
      console.log(responseClockedIn, '???');
      if (responseClockedIn.status == 'Bad Request') {
        console.log('aaaa?');
        toast.error(responseClockedIn.message, {
          position: 'top-right',
        });
      } else {
        toast.success(responseClockedIn.message, {
          position: 'top-right',
        });
        setClockedIn(!isClocked);
      }
    } else {
      const dtoAbsence = {
        clocked_out: formatAMPM(new Date()),
        date: moment().format('MM-DD-YYYY'),
        status: 'Clocked Out',
      };
      const responseClockedOut = await API.post(
        'ABSENCE',
        'update-status-clocked',
        dtoAbsence,
      );
      if (responseClockedOut.status === 'Bad Request') {
        toast.error(responseClockedOut.message, {
          position: 'top-right',
        });
      } else {
        toast.success(responseClockedOut.message, {
          position: 'top-right',
        });
        setClockedIn(!isClocked);
      }
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Calendar" />

      <button
        onClick={isClockedIn}
        className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
      >
        <AiFillClockCircle />
        {isClocked ? 'Clocked Out' : 'Clocked In'}
      </button>

      <Calendar bordered renderCell={renderCell} />
    </DefaultLayout>
  );
};

export default CalendarComp;
