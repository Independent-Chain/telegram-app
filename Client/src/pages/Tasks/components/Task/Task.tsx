import { ReactNode, useEffect, useState } from 'react';

// Custom hooks;
import { useAuth } from '@providers/AuthProvider.tsx';
import { useData } from '@providers/DataProvider.tsx';
import { useLocalization } from '@providers/LocalizationProvider.tsx';
import { useNotification } from '@providers/NotificationProvider.tsx';

// Custom API;
import { API_TASKS_COMPLETE } from '@API/api.tasks.complete.ts';
import { API_USER_GET } from '@API/api.user.get.ts';

// Custom components;
import Cell from '@ui/Cell/Cell';
import Icon from '@ui/Icon/Icon';
import Button from '@ui/Button/Button.tsx';

// Included styles;
import './Task.scss';


type Icons = 'telegram' | 'instagram' | 'youtube' | 'bingx';

interface ComponentProps {
  taskData: {
    task_id: number;
    status: boolean;
    icon: Icons;
    name: string;
    description: string;
    link: string;
    award: number;
  },
  completed: boolean;
}

const Task = ({ taskData, completed }: ComponentProps): ReactNode => {
   const { localization } = useLocalization();
   const { webApp, token } = useAuth();
   const { overwriteData } = useData();
   const { showNotification } = useNotification();

   const [completeStatus, setCompleteStatus] = useState<boolean>(completed);
   const [buttonText, setButtonText] = useState<string>(localization.tasks.buttons.start);

   useEffect(() => {
      setButtonText(localization.tasks.buttons.start);
   }, [localization]);

   const handleButtonClick = async () => {
      if (buttonText === localization.tasks.buttons.start) {
         if (taskData.icon === 'telegram') {
            webApp.openTelegramLink(taskData.link);
         } else {
            webApp.openLink(taskData.link);
         }
         setButtonText(localization.tasks.buttons.claim);
      } else if (buttonText === localization.tasks.buttons.claim) {
         await claimAward();
      }
   };

   const claimAward = async () => {
      try {
         const result = await API_TASKS_COMPLETE(token, webApp, taskData.task_id);
         if (result) {
            const response = await API_USER_GET(token, webApp);
            overwriteData(response);
            setCompleteStatus(true);
            showNotification("success", `${localization.notifications.tasks.c} ${taskData.award} tINCH.`);
         }
      } catch (error) {
         console.error(error);
         showNotification("error", localization.tasks.nc);
      }
   };

   return (
      <Cell
         before={
            <img className="task__icon" src={`/tasks-icons/${taskData.icon}.svg`} alt="task-icon" />
         }
         title={ taskData.name }
         description={`+${taskData.award} tINCH`}
         after={
            <Button
               disabled={ completeStatus }
               mode={ completeStatus || buttonText != localization.tasks.buttons.start ? "bezeled" : "white" }
               size="medium"
               haptic={["impact", "soft"]}
               style={{ margin: '0.3vh 0', padding: '0 6vw', fontSize: '2vh' }}
               onClick={() => !completed && handleButtonClick()}
               after={
                  completeStatus ? (
                     <Icon name="checkmark-circle-stroke-rounded" size={2.5} unit="vh" color="accent" />
                  ) : (
                     null
                  )
               }
            >
               { completeStatus ? ('') : (buttonText)}
            </Button>
         }
      />
   );
}

export default Task;