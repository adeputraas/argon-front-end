import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import UserTable from '../components/Tables/UserTable';
import DefaultLayout from '../layout/DefaultLayout';

const SummaryUsers = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Data Users" />

      <div className="flex flex-col gap-10">
        <UserTable />
      </div>
    </DefaultLayout>
  );
};

export default SummaryUsers;
