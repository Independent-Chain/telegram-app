// Custom hooks;
import { useData } from '@providers/DataProvider.tsx';
import { useLocalization } from '@providers/LocalizationProvider.tsx';

// Custom components;
import Title from '@ui/Typography/Title/Title.tsx';
import SubHeadline from '@ui/Typography/SubHeadline/SubHeadline.tsx';
import LeaderboardUser from './components/LeaderboardUser/LeaderboardUser.tsx';
import LeaderboardGeneral from './components/LeaderboardGeneral/LeaderboardGeneral.tsx';

// Included styles;
import './Leaderboard.scss';
import '@pages/page.scss';


interface ComponentProps { }

const Leaderboard = ({ }: ComponentProps): JSX.Element => {
	const { contextData } = useData();
	const { localization } = useLocalization();
	
	const userData = {
		username: contextData.metaData.username,
		balance: contextData.appData.balance,
		position: contextData.appData.rating,
	}

	return (
		<div className="page" id="leaderboard">
			<Title level={3} weight={2} color="white">{ localization.leaderboard.your_score }</Title>
			<LeaderboardUser username={ userData.username } balance={ userData.balance } position={ userData.position } />
			<div className="title-wrapper">
				<Title level={3} weight={2} color="white">{ localization.leaderboard.general.title }</Title>
				<SubHeadline color="gray">{ localization.leaderboard.general.description }</SubHeadline>
			</div>
			<LeaderboardGeneral />
		</div>
	)
}

export default Leaderboard;