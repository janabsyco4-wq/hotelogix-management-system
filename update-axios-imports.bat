@echo off
echo Updating axios imports in all client files...

powershell -Command "(Get-Content 'client\src\pages\RoomView.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\RoomView.js'"
powershell -Command "(Get-Content 'client\src\pages\SmartRoomFinder.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\SmartRoomFinder.js'"
powershell -Command "(Get-Content 'client\src\pages\Rooms.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\Rooms.js'"
powershell -Command "(Get-Content 'client\src\pages\RestaurantView.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\RestaurantView.js'"
powershell -Command "(Get-Content 'client\src\pages\RestaurantDetail.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\RestaurantDetail.js'"
powershell -Command "(Get-Content 'client\src\pages\ReserveTable.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\ReserveTable.js'"
powershell -Command "(Get-Content 'client\src\pages\RedeemDeal.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\RedeemDeal.js'"
powershell -Command "(Get-Content 'client\src\pages\ProcessRefund.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\ProcessRefund.js'"
powershell -Command "(Get-Content 'client\src\pages\Packages.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\Packages.js'"
powershell -Command "(Get-Content 'client\src\pages\PackageView.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\PackageView.js'"
powershell -Command "(Get-Content 'client\src\pages\PackageDetail.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\PackageDetail.js'"
powershell -Command "(Get-Content 'client\src\pages\MyBookings.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\MyBookings.js'"
powershell -Command "(Get-Content 'client\src\pages\Home.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\Home.js'"
powershell -Command "(Get-Content 'client\src\pages\Dining.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\Dining.js'"
powershell -Command "(Get-Content 'client\src\pages\DealView.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\DealView.js'"
powershell -Command "(Get-Content 'client\src\pages\Deals.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\Deals.js'"
powershell -Command "(Get-Content 'client\src\pages\DealDetail.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\DealDetail.js'"
powershell -Command "(Get-Content 'client\src\pages\BookRoom.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\BookRoom.js'"
powershell -Command "(Get-Content 'client\src\pages\BookPackage.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\BookPackage.js'"
powershell -Command "(Get-Content 'client\src\pages\Bookings.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\Bookings.js'"
powershell -Command "(Get-Content 'client\src\pages\AIAnalytics.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\AIAnalytics.js'"
powershell -Command "(Get-Content 'client\src\pages\AdminDashboard.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\pages\AdminDashboard.js'"
powershell -Command "(Get-Content 'client\src\components\StripePayment.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\components\StripePayment.js'"
powershell -Command "(Get-Content 'client\src\components\AIRecommendations.js') -replace \"import axios from 'axios';\", \"import axios from '../api/axios';\" | Set-Content 'client\src\components\AIRecommendations.js'"

echo Done! All axios imports updated.
echo Now commit and push to GitHub, then redeploy on Vercel.
