import { getCookiesTokens } from '@/modules/auth/services/manage-cookies';
import UserProfileScreen from '@/modules/profile/screens/user.profile.screen';

const getData = async () => {
	try {
		const { accessToken } = await getCookiesTokens();
		const response = await fetch(`http://localhost:3000/api/v1/users/profile`, {
			method: 'GET',
			headers: {
				// 'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		});

		// if (!response) {
		// 	return null;
		// }

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching profile:', error);
		return null;
	}
};

export default async function ProfilePage() {
	return <UserProfileScreen />;
}
