sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'xiajiqiangstudentg22/customermessages/test/integration/FirstJourney',
		'xiajiqiangstudentg22/customermessages/test/integration/pages/CustomerMessageList',
		'xiajiqiangstudentg22/customermessages/test/integration/pages/CustomerMessageObjectPage'
    ],
    function(JourneyRunner, opaJourney, CustomerMessageList, CustomerMessageObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('xiajiqiangstudentg22/customermessages') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheCustomerMessageList: CustomerMessageList,
					onTheCustomerMessageObjectPage: CustomerMessageObjectPage
                }
            },
            opaJourney.run
        );
    }
);