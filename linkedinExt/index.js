
/*
console.log("Extension is loaded....");
var LIT = {
    main : function(){
        console.log("Loading main function");  
        LIT.injectStyle("font-awesome-4.7.0/css/font-awesome.min.css") ;   
        LIT.injectStyle("index.css") ; 
        LIT.injectScript("jquery-1.12.4.js");
        LIT.injectScript("jquery-ui.js");
        LIT.injectScript("knockout-3.2.0.js");
        LIT.injectScript("web.js");          

    },
    injectStyle : function(file){
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = chrome.extension.getURL(file);
        (document.head||document.documentElement).appendChild(style);
    },
    injectScript : function(file){
        var script = document.createElement('script');
        script.src = chrome.extension.getURL(file);
        (document.head || document.documentElement).appendChild(script);
    }

}

LIT.main();
*/


console.log("Extension is loaded....");

var $LITjq;

var LIT = {
    injectStyle: function (file) {
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = chrome.extension.getURL(file);
        (document.head || document.documentElement).appendChild(style);
    },
    injectScript: function (file) {
        var script = document.createElement('script');
        script.src = chrome.extension.getURL(file);
        (document.head || document.documentElement).appendChild(script);
    },
    waitForJqueryUI: function () {
        if (typeof jQuery !== 'undefined' && typeof jQuery.fn.jquery !== 'undefined' && typeof jQuery.ui !== 'undefined') {
            $LITjq = jQuery.noConflict(true);
            jQuery = $ = $LITjq.noConflict(true);
            LIT.main();
        }
        else {
            console.log("jQuery UI not loaded...");
            window.setTimeout(LIT.waitForJqueryUI, 500);
        }
    },
    html: `
    <div id='LITWindow' class='LIT-window LIT-Window-Min'> 
        <div id='LITMinWindow' class='LIT-show'>
            <button id="LIT-open" class="LIT-button">Open LinkedIn Tool <i class="fa fa-expand" aria-hidden="true" ></i></button>
            <span class="LIT-button LIT-WindowDragHandle">
                <i class="fa fa-arrows-alt" aria-hidden="true" ></i> 
            </span>
        </div>
        <div id='LITMaxWindow' class='LIT-hide'>
            <div class="LIT-TitleBar">
                <span class="LIT-Float-Left">
                LinkedIn Tool
                </span>
                <span class="LIT-button LIT-WindowDragHandle LIT-Float-Right">
                    <i class="fa fa-arrows-alt" aria-hidden="true" ></i> 
                </span>
                <button id="LIT-close" class="LIT-button LIT-Float-Right">
                    <i class="fa fa-compress" aria-hidden="true" ></i> 
                </button>
            </div>
            <div class="LIT-tab" data-bind="foreach: tabs">
                <button  data-bind="text: $data, 
                css: { active : $data == $root.chosenTabId() },
                click: $root.goToTab">
                </button>
            </div>
            <div class="LIT-tabcontent">
                <div data-bind="if: chosenTabId() === 'Dashboard'">
                    
                </div>
                <div data-bind="if: chosenTabId() === 'Pipeline'">
                    <div>
                        <table class="LIT-table">
                            <tr>
                                <td>
                                    <span>URL</span>
                                
                                    <span class="LIT-button LIT-Float-Right LIT-align-openurlbutton">
                                        <i class="fa " 
                                        data-bind="
                                        css: { 
                                            'fa-external-link' : searchURL().length > 0  , 
                                            'fa-arrow-down' : searchURL().length == 0
                                        },
                                        click: copyAndOpenURL"
                                        aria-hidden="true" ></i> 
                                    </span>
                                </td>
                                <td><input type="text" id="pipelineURL" name="pipelineURL" class="LIN-input" data-bind="value: searchURL"></td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td> <span data-bind="text: status"></span> </td>
                            </tr>
                            <tr>
                                <td>Collected Count</td>
                                <td><span data-bind="text: profileCount"></span></td>
                            </tr>   
                            <tr>
                                <td>Action</td>
                                <td>
                                    <span data-bind="
                                    css: { 
                                        'LIT-hide' : searchURL().length == 0,
                                        'LIT-show' : searchURL().length > 0
                                    }">
                                        <span class="LIT-button LIT-importButton"  data-bind="click: importProfile">
                                            <i class="fa " data-bind="
                                            css: { 
                                                'fa-refresh' : (isCollectingProfile() === true)  ,
                                                'fa-spin' : (isCollectingProfile() === true ) ,
                                                'fa-arrow-down' : (isCollectingProfile() === false)
                                            }"
                                            aria-hidden="true" ></i> 
                                        </span>
                                    </span>
                                </td>
                            </tr>
                        </table>    
                    </div>
                    <div data-bind="foreach: profiles()">
                        <div class="LIT-card">
                            <img data-bind="attr: { src: $root.getImage($data.img) }" class="LIT-img" alt="Avatar">
                            <div class="LIT-card-container">
                                <span class="LIT-medium-font"><b data-bind="text: ($data.fname +' '+ $data.lname)"></b></span>
                                <br><br>
                                <span class="LIT-small-font" data-bind="text: ($data.title + ' / '+ $data.company)"></span> 
                                <br>
                            </div>
                        </div>        
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    minWindow: function () {

    },
    maxWindow: function () {

    },
    eventRegistration: function () {
        $LITjq("#LIT-open").click(function () {

            $("#LITMinWindow").slideToggle("slow", function () {
                $LITjq("#LITWindow").removeClass("LIT-Window-Min").addClass("LIT-Window-Max");
                $("#LITMaxWindow").slideToggle("slow");
            });

        });

        $LITjq("#LIT-close").click(function () {

            $("#LITMaxWindow").slideToggle("slow", function () {
                $LITjq("#LITWindow").removeClass("LIT-Window-Max").addClass("LIT-Window-Min");
                $("#LITMinWindow").slideToggle("slow");
            });
        });
    },
    setDraggable: function () {
        console.log("Jquery Version : " + $.fn.jquery);
        console.log("Jquery UI Version : " + $.ui.version);

        $LITjq('#LITWindow').draggable(
            {
                scroll: false,
                containment: "window",
                handle: '.LIT-WindowDragHandle'
            }
        );

    },
    addHolder: function () {
        /*
        // append to body
        var div = document.createElement('div');
        div.setAttribute("id", "LITHolder");
        div.innerHTML = LIT.html;
        document.body.append(div);
        */
        $LITjq("body").append(LIT.html);
    },
    getHolder: function () {

    },
    knockoutBind: function () {
        /*
        // Here's my data model
        var ViewModel = function(first, last) {
            this.firstName = ko.observable(first);
            this.lastName = ko.observable(last);
        
            this.fullName = ko.computed(function() {
                // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
                return this.firstName() + " " + this.lastName();
            }, this);
        };
        */
        ko.applyBindings(new LITViewModel()); // This makes Knockout get to work
    },
    main: function () {
        console.log("Loading main function");
        LIT.injectStyle("font-awesome-4.7.0/css/font-awesome.min.css");
        LIT.injectStyle("index.css");

        LIT.addHolder();
        LIT.knockoutBind();
        LIT.setDraggable();
        LIT.eventRegistration();
    }
}

function LITViewModel() {
    // Data
    var self = this;

    //self.result = [{ "fname": "P", "lname": "Gupta", "title": "", "company": "Principal Consultant, Oracle India", "link": "www.linkedin.com/in/parashargupta/", "img": "https://media.licdn.com/dms/image/C4D03AQHdWHxaPDc_Ng/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=JXQ1ygQwe5wa2PoXxl7xTkKcLdlkZjGqYlSURmtL5p4" }, { "fname": "Harish", "lname": "Muniraju", "title": "Director Oracle Talent Advisory", "company": "Oracle India Pvt. Ltd", "link": "www.linkedin.com/in/harishmuniraju/", "img": "https://media.licdn.com/dms/image/C4E03AQHR39LCHamLYQ/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=22_6q9fcKlGVHRHbdoqynugrL9ngzod9oMivN0CAAIM" }, { "fname": "Abhijit", "lname": "Bhattacharjee", "title": "SDE III (Architect)", "company": "Amazon", "link": "www.linkedin.com/in/itabhijitb/", "img": "https://media.licdn.com/dms/image/C4D03AQE0SPHu7oDYiA/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=gQDacXsThjp6IF0DQrqIBzplAfBiHx06HIGd8Dz4FLc" }, { "fname": "Ranjay", "lname": "Singh", "title": "SMTS - Senior Data Engineer", "company": "Oracle Labs", "link": "www.linkedin.com/in/ranjay2084/", "img": "https://media.licdn.com/dms/image/C5103AQFtby1cmJjN6A/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=hqt8Y8BCrNsriJ2UxjcjT5zOa0CEzfUZriPkIug1Db8" }, { "fname": "Balaji", "lname": "Datta", "title": "Manager ( QA Team & Upgrade Engineering Team ) Certified CSM", "company": "Oracle", "link": "www.linkedin.com/in/balajidatta/", "img": "https://media.licdn.com/dms/image/C5103AQEfGAwEviG4Qw/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=KL7mmCLEr6d7xC6vnem_4WgjufMb5RduVx1iY05CDqo" }, { "fname": "Monish", "lname": "K", "title": "", "company": "Principal Member of Technical Staff @ Oracle | BI team", "link": "www.linkedin.com/in/monishk/", "img": "https://media.licdn.com/dms/image/C5103AQHvrZBeNwE-xQ/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=Kpw27_t4469lEXE57VXU0ZRT_FZwiv8Ohols1lq3ZyM" }, { "fname": "Swati", "lname": "Verma", "title": "Senior Talent Advisor", "company": "Oracle", "link": "www.linkedin.com/in/swati-verma-73448418/", "img": "https://media.licdn.com/dms/image/C4D03AQFVCWEjU_Skow/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=cbUUa1z9Jk8QAg7OCREHciQXN3zAP0wZewA07h86T_s" }, { "fname": "Lalit", "lname": "Singh", "title": "Talent Advisor", "company": "Oracle India | Ex - Army", "link": "www.linkedin.com/in/lalitsingh405/", "img": "https://media.licdn.com/dms/image/C5103AQGLym_oBTiLdg/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=X14OpsRnv2IAjTo_eD0L-LcdxB78ea-XmP15SF9Mou8" }, { "fname": "Ajith", "lname": "Kumar", "title": "", "company": "If I view your profile, I likely have a job for you.", "link": "www.linkedin.com/in/ajmba20/", "img": "https://media.licdn.com/dms/image/C5103AQHJiIArVDMVkg/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=YIpgtyIOIxwO_xt-Bc8XW1RpMfSJmccE1Jx0vSTXkRI" }, { "fname": "Skant Gupta, OCM, Exadata, Cloud and MAA,", "lname": "PMP®", "title": "Co-Founder", "company": "OracleHelp", "link": "www.linkedin.com/in/skantali/", "img": "https://media.licdn.com/dms/image/C4D03AQHYTiPyZ7gZ7Q/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=oFiLW6jTqE19ZTfMDDHkVjMNkPAGwvqMdv415lUiAiw" }];
    self.result = [];
    self.tabs = ['Dashboard', 'Pipeline', 'Lead', 'Maintenance', 'Dropped'];
    self.chosenTabId = ko.observable(self.tabs[0]);
    self.searchURL = ko.observable('');
    self.profiles = ko.observableArray(self.result);
    self.isCollectingProfile = ko.observable(false);
    self.status = ko.observable('Yet To Start');
    self.profileCount = ko.observable(0);
    // Behaviours    
    self.goToTab = function (tab) {
        self.chosenTabId(tab);
        console.log("Go To Tab :" + tab);
    };

    self.copyAndOpenURL = function () {
        if (self.searchURL().length == 0)
            self.searchURL(window.location.href);
        else
            window.open(self.searchURL());
    };
    self.importProfile = function () {
        console.log("Importing profile");
        self.isCollectingProfile(true);
        self.status("In Progress");
        $("html").animate({ scrollTop: $(document).height() }, 100, function () {
            setTimeout(self.collectProfile, 5000);
        });
    };

    self.getImage = function (img) {
        if (img == 'Not Found') return 'https://www.w3schools.com/howto/img_avatar.png';
        return img;
    };

    self.collectProfile = function () {
        var data = [];
        $('.search-results__list li').each(function () {
            var fullname = $.trim($(this).find('.actor-name').text());
            var fullName = fullname.split(' '),
                firstName = fullName.shift(),
                lastName = fullName.join(" ");

            var temp = $.trim($(this).find('.subline-level-1').text()).split(' at ');
            var title = temp.shift();
            var company = temp.join(" ");

            var link = $.trim($(this).find('.search-result__result-link').attr("href"));
            var img = $(this).find('img').attr("src");
            if (img === undefined) { img = 'Not Found'; }
            var entry = {
                fullName: fullname,
                fname: firstName,
                lname: lastName,
                title: title,
                company: company,
                link: window.location.host + link,
                img: img
            }
            data.push(entry);
        });
        self.profiles(data);
        console.log(data);
        self.isCollectingProfile(false);
        self.status("Completed");
        self.profileCount(self.profiles().length);
    }

};

LIT.waitForJqueryUI();