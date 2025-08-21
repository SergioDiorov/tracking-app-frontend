import React, { FC, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';
import {
  IOrganizationTaskType,
  TaskWorkStatusEnum,
} from '@/interfaces/organization';
import {
  formatloggedTimeDuration,
  generatePriorityBgColor,
  handleFormatWorkStatus,
} from '../constants';
import { Loader } from '@/components/ui/loader';
import ExpandedTaskModal from '../TasksTab/ExpandedTaskModal/ExpandedTaskModal';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2Icon,
} from 'lucide-react';

interface MemberProgressType {
  name: string;
  avatarUrl: string;
  id: string;
}

interface UserRowProps {
  member: MemberProgressType;
  dates: string[];
  isLastItem: boolean;
}

const UserRow: FC<UserRowProps> = ({ member, dates, isLastItem }) => {
  const [memeberTasks, setMemberTasks] = useState<{
    [date: string]: IOrganizationTaskType[];
  }>({});
  const [openTaskModal, setOpenTaskModal] = useState<boolean>(false);
  const [selectedTaskModal, setSelectedTaskModal] =
    useState<IOrganizationTaskType | null>(null);

  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  const {
    data: organizationTasksData,
    isLoading: organizationTasksIsLoading,
    isSuccess: organizationTasksIsSuccess,
  } = useQuery({
    queryKey: ['getOrganizationMemberTasks', organizationId, member.id],
    queryFn: () =>
      organizationsApi.getOrganizationTasks({
        organizationId,
        page: 1,
        limit: 50,
        userId: member.id,
      }),
    select: (res) => res.data,
    enabled: !!organizationId && !!member.id,
  });

  const {
    data: tasksProgressData,
    isLoading: tasksProgressIsLoading,
    isFetching: tasksProgressIsFetching,
  } = useQuery({
    queryKey: [
      'getOrganizationTasksProgressMember',
      organizationId,
      dates,
      member?.id,
    ],
    queryFn: () =>
      organizationsApi.getOrganizationTasksProgress({
        organizationId,
        startDate: new Date(dates[0]).toISOString(),
        endDate: new Date(dates[dates.length - 1]).toISOString(),
        userId: member.id,
      }),
    select: (res) => res.data,
    enabled: !!organizationId && !!dates.length && !!member?.id,
  });

  useEffect(() => {
    if (organizationTasksData && organizationTasksIsSuccess) {
      const memberTasksFormattedObj: {
        [date: string]: IOrganizationTaskType[];
      } = {};

      organizationTasksData.data.tasks.forEach((task) => {
        const deadline = new Date(task.deadline);
        const dateKey = deadline.toISOString().split('T')[0];

        if (!memberTasksFormattedObj[dateKey]) {
          memberTasksFormattedObj[dateKey] = [];
        }

        memberTasksFormattedObj[dateKey].push(task);
      });

      setMemberTasks(memberTasksFormattedObj);
    }
  }, [organizationTasksData, organizationTasksIsSuccess]);

  const datesWithMoreThanOneTask = Object.entries(memeberTasks)
    .filter(([_, tasks]) => tasks.length > 1)
    .map(([date]) => date);

  return (
    <div
      className={`grid grid-cols-[200px_repeat(7,minmax(100px,1fr))] ${
        !isLastItem && 'border-b'
      }`}
    >
      <div className='flex items-center gap-2 p-2 border-r relative'>
        {organizationTasksIsLoading ? (
          <div className='w-full flex justify-center items-center'>
            <Loader hideText />
          </div>
        ) : (
          <>
            <div className='flex justify-center items-center gap-2'>
              <Avatar className='w-8 h-8'>
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>{member.name}</span>
                {tasksProgressIsLoading || tasksProgressIsFetching ? (
                  <Loader2Icon className='animate-spin size-[18px] !text-gray-400' />
                ) : (
                  <div className='text-xs font-normal text-muted-foreground h-[18px] opacity-70'>
                    <span>
                      {formatloggedTimeDuration(
                        tasksProgressData?.totalLoggedTimeSec || 0,
                      )}
                    </span>
                    <span>
                      /
                      {formatloggedTimeDuration(
                        tasksProgressData?.totalLoggedTimeSecMonth || 0,
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {dates.map((date) => (
        <div key={date} className='p-2 min-h-[81px] border-r'>
          <Carousel>
            <CarouselContent>
              {!!memeberTasks &&
                memeberTasks[date]?.map((task, idx) => (
                  <CarouselItem key={idx}>
                    <Card
                      onClick={() => {
                        setOpenTaskModal(true);
                        setSelectedTaskModal(task);
                      }}
                      className={`p-2 hover:cursor-pointer hover:shadow-lg transition ${
                        task.priority
                          ? generatePriorityBgColor({
                              value: task.priority,
                            })
                          : '#f3f4f6'
                      }`}
                    >
                      <div className='text-xs font-medium truncate'>
                        {task.title}
                      </div>
                      <div className='text-[10px] text-muted-foreground'>
                        <span>Status</span>
                        <span className='font-semibold pl-1'>
                          {handleFormatWorkStatus(
                            task?.workStatus || TaskWorkStatusEnum.TODO,
                          )}
                        </span>
                      </div>
                      <div className='text-[10px] text-muted-foreground'>
                        <span>Time:</span>
                        <span className='font-semibold pl-1'>
                          {formatloggedTimeDuration(task.loggedTimeSec || 0)}
                        </span>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
            </CarouselContent>
            {datesWithMoreThanOneTask.includes(date) && (
              <>
                <CarouselPrevious className='!-left-[5px] !border-none !bg-gray-400/60 disabled:!bg-gray-400/30 !text-white !w-[18px] !p-0 !h-[18px]' />
                <CarouselNext className='!-right-[5px] !border-none !bg-gray-400/60 disabled:!bg-gray-400/30 !text-white !w-[18px] !p-0 !h-[18px]' />
              </>
            )}
          </Carousel>
        </div>
      ))}

      {!!selectedTaskModal && (
        <ExpandedTaskModal
          open={openTaskModal}
          onOpenChange={setOpenTaskModal}
          taskData={selectedTaskModal as IOrganizationTaskType}
        />
      )}
    </div>
  );
};

const ProgressTab = () => {
  const [membersRows, setMembersRows] = useState<MemberProgressType[]>([]);
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [progressDates, setProgressDates] = useState<string[]>([]);
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [memberButtonOrderClicked, setMemberButtonOrderClicked] = useState<
    'top' | 'bottom' | null
  >(null);

  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  const {
    data,
    refetch,
    isLoading: isMembersLoading,
    isFetching: isMembersFetching,
  } = useQuery({
    queryKey: ['getOrganizationsMembers', organizationId, 'limit:5'],
    queryFn: () =>
      organizationsApi.getOrganizationMembers({
        organizationId,
        page: paginationPage,
        limit: 5,
      }),
    select: (res) => res.data,
    enabled: !!organizationId && !!paginationPage,
  });

  const {
    data: tasksProgressData,
    isLoading: tasksProgressIsLoading,
    isFetching: tasksProgressIsFetching,
  } = useQuery({
    queryKey: ['getOrganizationTasksProgress', organizationId, progressDates],
    queryFn: () =>
      organizationsApi.getOrganizationTasksProgress({
        organizationId,
        startDate: new Date(progressDates[0]).toISOString(),
        endDate: new Date(
          progressDates[progressDates.length - 1],
        ).toISOString(),
      }),
    select: (res) => res.data,
    enabled: !!organizationId && !!progressDates.length,
  });

  useEffect(() => {
    if (data) {
      const rowMembers: MemberProgressType[] = data.data.members.map(
        (member) =>
          ({
            name:
              (member?.userProfile?.firstName || '') +
              ' ' +
              (member?.userProfile?.lastName || ''),
            avatarUrl: member?.userProfile?.avatar || '',
            id: member?.userProfile?.userId,
            tasks: undefined,
          } as MemberProgressType),
      );

      setMembersRows(rowMembers);
    }
  }, [data]);

  useEffect(() => {
    if (paginationPage) refetch();
  }, [paginationPage]);

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((currentDay + 6) % 7) + weekOffset * 7);

    const dates = Array.from({ length: 7 }, (_, i) =>
      format(new Date(monday.getTime() + i * 86400000), 'yyyy-MM-dd'),
    );

    setProgressDates(dates);
  }, [weekOffset]);

  return (
    <div className='overflow-auto rounded-md border relative'>
      {/* Header */}
      <div className='relative group grid grid-cols-[200px_repeat(7,minmax(100px,1fr))] bg-muted text-muted-foreground font-semibold text-sm'>
        <Button
          className='h-auto p-2 border-r border-b rounded-none bg-transparent hover:bg-transparent !text-gray-400 disabled:!text-gray-400/40 w-full'
          variant='ghost'
          disabled={
            isMembersLoading ||
            isMembersFetching ||
            data?.pagination.currentPage === 1
          }
          onClick={() => {
            setPaginationPage((prev) => prev - 1);
            setMemberButtonOrderClicked('top');
          }}
        >
          {isMembersFetching && memberButtonOrderClicked === 'top' ? (
            <Loader2Icon className='animate-spin size-[18px] relative left-1 !text-gray-400' />
          ) : (
            <ChevronUp />
          )}
        </Button>
        {progressDates.map((date) => (
          <div
            key={date}
            className='p-2 text-left border-r border-b flex items-center justify-between gap-2'
          >
            <div className='flex items-center gap-2'>
              <span className='text-[26px] '>
                {format(new Date(date), 'dd')}
              </span>
              <div className='flex flex-col items-start leading-7'>
                <span className='text-xs opacity-70'>
                  {format(new Date(date), 'EE')}
                </span>
                <span className='text-[10px] leading-3 opacity-70'>
                  {format(new Date(date), 'MMM')}
                </span>
              </div>
            </div>

            <div>
              {tasksProgressIsLoading || tasksProgressIsFetching ? (
                <Loader2Icon className='animate-spin size-[18px] relative opacity-70' />
              ) : (
                <span className='text-xs opacity-70'>
                  {formatloggedTimeDuration(
                    tasksProgressData?.totalLoggedTimePerDates?.[date] ?? 0,
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Rows */}
      {membersRows.map((member, idx) => (
        <UserRow
          key={member.id}
          member={member}
          dates={progressDates}
          isLastItem={idx === membersRows.length - 1}
        />
      ))}

      <div className='h-[38px] bg-muted text-muted-foreground flex items-center justify-start border-t'>
        <div className='w-full max-w-[200px] self-start border-r h-full flex items-center justify-center'>
          <Button
            className='bg-transparent hover:bg-transparent p-0 !text-gray-400 disabled:!text-gray-400/40 w-full max-h-[37px]'
            variant='ghost'
            disabled={
              isMembersLoading ||
              isMembersFetching ||
              data?.data.members.length !== data?.pagination.pageSize
            }
            onClick={() => {
              setPaginationPage((prev) => prev + 1);
              setMemberButtonOrderClicked('bottom');
            }}
          >
            {isMembersFetching && memberButtonOrderClicked === 'bottom' ? (
              <Loader2Icon className='animate-spin size-[18px] relative left-1 !text-gray-400' />
            ) : (
              <ChevronDown />
            )}
          </Button>
        </div>
        {/* <div className='w-full max-w-[200px] self-start border-r h-full' /> */}
        <div className='w-full flex items-center justify-between'>
          <p className='font-semibold text-sm pl-4 min-w-fit flex items-center justify-center'>
            Week:{' '}
            {tasksProgressIsLoading || tasksProgressIsFetching ? (
              <Loader2Icon className='animate-spin size-[18px] relative left-1' />
            ) : (
              <>
                <span className='pl-1'>
                  {formatloggedTimeDuration(
                    tasksProgressData?.totalLoggedTimeSec || 0,
                  )}
                </span>
                <span>
                  /
                  {formatloggedTimeDuration(
                    tasksProgressData?.totalLoggedTimeSecMonth || 0,
                  )}
                </span>
              </>
            )}
          </p>

          {!!progressDates.length && (
            <div className='flex items-center justify-center gap-2 pr-3'>
              <div className='items-center justify-end flex transition z-30'>
                <Button
                  className='!text-gray-400 disabled:!text-gray-400/40 h-fit px-0 py-1'
                  variant='ghost'
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                >
                  <ChevronLeft />
                </Button>
              </div>

              <div className='text-muted-foreground font-semibold text-sm flex items-center justify-center gap-1'>
                <p>{format(new Date(progressDates[0]), 'dd MMM')}</p>
                <span>-</span>
                <p>
                  {format(
                    new Date(progressDates[progressDates.length - 1]),
                    'dd MMM',
                  )}
                </p>
              </div>

              <div className='items-center justify-end flex transition z-20'>
                <Button
                  className='!text-gray-400 disabled:!text-gray-400/40 h-fit px-0 py-1'
                  variant='ghost'
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTab;
