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

interface Users {
  id: string;
  photo: string;
  username: string;
  role: string;
  email: string;
  phoneNumber: string;
  password: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  active: number;
}

const UserTable = () => {
  const { globalState, setGlobalState } = useAppContext();
  const [data, setData] = useState<Users[]>([]);
  const [open, setOpen] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [action, setAction] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedIdUser, setIdUser] = useState('');

  const retrieveSummary = async () => {
    const respRetrieveAbsence = await API.get('USERS', `retrieve-all-user`);
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
  }, [globalState]);

  const openModal = (action: string, id: any, idUser: any) => {
    setOpen(!open);
    setAction(action);
    setSelectedId(id);
    setIdUser(idUser);
  };

  const openRemoveModalFunc = (id: any, name: any) => {
    setOpenRemoveModal(!openRemoveModal);
    setSelectedName(name);
    setSelectedId(id);
    setIdUser(id);
  };

  const generateInitialValues = () => {
    if (selectedId) {
      const selectedItems = data.find((dt) => dt.id === selectedId);
      return {
        userName: selectedItems?.username,
        email: selectedItems?.email,
        password: selectedItems?.password,
        phoneNumber: selectedItems?.phoneNumber,
        file: undefined,
        position: selectedItems?.role,
      };
    }
    return {
      userName: '',
      email: '',
      password: '',
      file: undefined,
      phoneNumber: '',
      position: '',
      users_id: '',
    };
  };

  const validationSchema: Yup.Schema<FormValues> = Yup.object().shape({
    userName: Yup.string().required('User Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long'),

    file: Yup.mixed().required('File is required'),
    // file: Yup.mixed<File>()
    //   .required('File is required')
    //   .test('fileFormat', 'Only image files are allowed', (value) => {
    //     if (value) {
    //       return !['jpeg', 'jpg', 'png', 'gif'].includes(value.toString());
    //     }
    //     return true;
    //   }),
    phoneNumber: Yup.string()
      .required('Phone Number is required')
      .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    position: Yup.string().required('Position is required'),
  });

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    event?.preventDefault();
    // return console.log(values, action,'??')

    const api = action == 'add' ? 'create-users' : 'update-profil-users';
    let objAssign = {};
    if (action == 'add') {
      objAssign = {
        email: values.email,
        username: values.userName,
        password: values.password,
        role: values.position,
        phoneNumber: values.phoneNumber,
      };
    } else {
      objAssign = {
        uid: selectedIdUser,
        email: values.email,
        username: values.userName,
        password: values.password,
        role: values.position,
        phoneNumber: values.phoneNumber,
      };
    }

    const response = await API.uploadFile('USERS', api, values.file, objAssign);
    if (response.status === 'Bad Request') {
      toast.error(response.message, {
        position: 'top-right',
      });
    } else {
      toast.success(response.message, {
        position: 'top-right',
      });

      setGlobalState({ ...globalState, isProfileUpdate: true });
      setOpen(false);
      setSubmitting(false);
    }
  };

  const handleRemoveUser = async () => {
    const removeResp = await API.post('USERS', `delete-users/${selectedId}`);
    if (removeResp.status === 'Bad Request') {
      toast.error(removeResp.message, {
        position: 'top-right',
      });
    } else {
      toast.success(removeResp.message, {
        position: 'top-right',
      });
      setOpenRemoveModal(false)
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>
          <Modal.Title>
            {action === 'add' ? 'Add Employee' : 'Edit Employee'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={generateInitialValues()}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              // Your submission logic here
              // Make sure to call setSubmitting(false) when done
              handleSubmit(values, setSubmitting);
            }}
          >
            {({ isSubmitting, handleSubmit, setFieldValue }) => (
              <Form>
                <div>
                  <label
                    htmlFor="userName"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    User Name
                  </label>
                  <Field
                    type="text"
                    name="userName"
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  />
                  <div style={{ color: 'red', fontSize: '14px' }}>
                    <ErrorMessage name="userName" component="div" />
                  </div>
                </div>
                <br />
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Field
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="email"
                    name="email"
                  />
                  <div style={{ color: 'red', fontSize: '14px' }}>
                    <ErrorMessage name="email" component="div" />
                  </div>
                </div>
                <br />
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Field
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="password"
                    name="password"
                  />
                  <div style={{ color: 'red', fontSize: '14px' }}>
                    <ErrorMessage name="password" component="div" />
                  </div>
                </div>
                <br />
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                  </label>
                  <Field
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="tel"
                    name="phoneNumber"
                  />
                  <div style={{ color: 'red', fontSize: '14px' }}>
                    <ErrorMessage name="phoneNumber" component="div" />
                  </div>
                </div>
                <br />
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="position"
                  >
                    Position
                  </label>
                  <Field
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="position"
                  />
                  <div style={{ color: 'red', fontSize: '14px' }}>
                    <ErrorMessage name="position" component="div" />
                  </div>
                </div>
                <br />
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="file"
                  >
                    File
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file =
                        event.currentTarget.files &&
                        event.currentTarget.files[0];
                      if (file) {
                        setFieldValue('file', file);
                      }

                      // setFieldValue('file', file);
                    }}
                  />
                  <div style={{ color: 'red', fontSize: '14px' }}>
                    <ErrorMessage name="file" component="div" />
                  </div>
                </div>
                <br />
                <div className="flex" style={{ justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    onClick={() => handleSubmit()}
                    appearance="primary"
                  >
                    Ok
                  </Button>{' '}
                  &nbsp;
                  <Button onClick={() => setOpen(false)} appearance="subtle">
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal
        backdrop="static"
        role="alertdialog"
        open={openRemoveModal}
        onClose={() => setOpenRemoveModal(false)}
        size="xs"
      >
        <Modal.Body>
          <RemindIcon style={{ color: '#ffb300', fontSize: 24 }} />
          Removing <b>{selectedName}</b>, Are you sure you want to proceed ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleRemoveUser}
            appearance="primary"
          >
            Ok
          </Button>
          <Button onClick={() => setOpenRemoveModal(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-right sm:justify-between">
        <button
          className="bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
          type="button"
          onClick={() => openModal('add', null, null)}
        >
          Add Employee
        </button>
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
              Email
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">
              Phone Number
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">
              Role
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-semibold uppercase xsm:text-base">
              Action
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
              <p className="text-black dark:text-white">{brand.email}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{brand.phoneNumber}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{brand.role}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <button
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                type="button"
                onClick={() => openModal('edit', brand.id, brand.id)}
              >
                Edit
              </button>
              &nbsp;
              <button
                className="flex justify-center rounded bg-danger py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                type="button"
                onClick={() => openRemoveModalFunc(brand.id, brand.username)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
