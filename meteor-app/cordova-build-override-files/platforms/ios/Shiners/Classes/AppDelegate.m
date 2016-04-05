/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  meteor-app
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"

#import <Cordova/CDVPlugin.h>

@implementation AppDelegate

@synthesize window, viewController;

- (id)init
{
    /** If you need to do any extra app-specific initialization, you can do it here
     *  -jm
     **/
    NSHTTPCookieStorage* cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];

    [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];

    int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
    int cacheSizeDisk = 32 * 1024 * 1024; // 32MB
#if __has_feature(objc_arc)
        NSURLCache* sharedCache = [[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"];
#else
        NSURLCache* sharedCache = [[[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"] autorelease];
#endif
    [NSURLCache setSharedURLCache:sharedCache];

    self = [super init];
    return self;
}

#pragma mark UIApplicationDelegate implementation

/**
 * This is main kick off after the app inits, the views and Settings are setup here. (preferred - iOS4 and up)
 */
- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    CGRect screenBounds = [[UIScreen mainScreen] bounds];

#if __has_feature(objc_arc)
        self.window = [[UIWindow alloc] initWithFrame:screenBounds];
#else
        self.window = [[[UIWindow alloc] initWithFrame:screenBounds] autorelease];
#endif
    self.window.autoresizesSubviews = YES;

#if __has_feature(objc_arc)
        self.viewController = [[MainViewController alloc] init];
#else
        self.viewController = [[[MainViewController alloc] init] autorelease];
#endif

    // Set your app's start page by setting the <content src='foo.html' /> tag in config.xml.
    // If necessary, uncomment the line below to override it.
    // self.viewController.startPage = @"index.html";

    // NOTE: To customize the view's frame size (which defaults to full screen), override
    // [self.viewController viewWillAppear:] in your view controller.

    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];
    
    // -------------- Objective DDP code --------------------
    self.meteorClient =  [[MeteorClient alloc] initWithDDPVersion:@"pre2"];
    // Testing against a local ddp server (i.e. meteor server)
    //ObjectiveDDP *ddp = [[ObjectiveDDP alloc] initWithURLString:@"ws://192.168.1.61:3000/websocket" delegate:self.meteorClient];
    //ObjectiveDDP *ddp = [[ObjectiveDDP alloc] initWithURLString:@"ws://msg.webhop.org/websocket" delegate:self.meteorClient];
    ObjectiveDDP *ddp = [[ObjectiveDDP alloc] initWithURLString:@"ws://www.shiners.ru/websocket" delegate:self.meteorClient];
    self.meteorClient.ddp = ddp;
    [self.meteorClient addObserver:self forKeyPath:@"websocketReady" options:NSKeyValueObservingOptionNew context:nil];
    // Testing against a remote ddp server (i.e. meteor server hosted on meteor.com)
    //ddp = [[ObjectiveDDP alloc] initWithURLString:@"wss://<yoursubdomain>.meteor.com/websocket" delegate:mc];
    [ddp connectWebSocket];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reportConnection) name:MeteorClientDidConnectNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reportDisconnection) name:MeteorClientDidDisconnectNotification object:nil];
    // ------------------------------------------------------
    
    [self initLocation];

    return YES;
}
-(void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSString *,id> *)change context:(void *)context
{
    if ([keyPath isEqualToString:@"websocketReady"] && self.meteorClient.websocketReady){
        if (self.lastLocation){
            [self reportLocation:self.lastLocation];
        }
    }
}

-(void)reportLocation: (CLLocation *)location{
    NSString *deviceId = [self getDeviceId];
    NSString *oldDeviceId = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    NSLog(@"device ID: cordova: %@, ios: %@", deviceId, oldDeviceId);
    
    NSLog(@"Submitting location: %f, %f", location.coordinate.latitude, location.coordinate.longitude);
    
    NSDictionary *report = @{
                             @"deviceId": deviceId,
                             @"lat":[NSNumber numberWithDouble:location.coordinate.latitude],
                             @"lng":[NSNumber numberWithDouble:location.coordinate.longitude]
                             };
    
    [self.meteorClient callMethodName:@"reportLocation" parameters:@[report] responseCallback:^(NSDictionary *response, NSError *error) {
        if (error){
            NSLog(@"Location report error: %@", error);
        } else {
            NSLog(@"Location report successful");
        }
    }];
    self.lastLocation = nil;
}

-(void)didReceiveMessage:(NSDictionary *)message{
    NSLog(@"message received");
    NSLog(@"%@", message);
}

-(void)reportConnection{
    NSLog(@"DDP connected");
}

-(void)reportDisconnection{
    NSLog(@"DDP disconnected");
}

-(void)initLocation
{
    self.locationManager = [[CLLocationManager alloc]init];
    self.locationManager.delegate = self;
    
    [self.locationManager requestAlwaysAuthorization];
    
    [self.locationManager startMonitoringSignificantLocationChanges];
}

-(NSString*)getDeviceId
{
    NSUserDefaults* userDefaults = [NSUserDefaults standardUserDefaults];
    static NSString* UUID_KEY = @"CDVUUID";
    
    NSString* app_uuid = [userDefaults stringForKey:UUID_KEY];
    
    if (app_uuid == nil) {
        CFUUIDRef uuidRef = CFUUIDCreate(kCFAllocatorDefault);
        CFStringRef uuidString = CFUUIDCreateString(kCFAllocatorDefault, uuidRef);
        
        app_uuid = [NSString stringWithString:(__bridge NSString*)uuidString];
        [userDefaults setObject:app_uuid forKey:UUID_KEY];
        [userDefaults synchronize];
        
        CFRelease(uuidString);
        CFRelease(uuidRef);
    }
    
    return app_uuid;
}

-(void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations
{
    CLLocation *location = [locations lastObject];
 
    NSLog(@"Location reported");
    NSLog(@"%@", location);
    NSLog(@"latitude %+.6f, longitude %+.6f\n",
          location.coordinate.latitude,
          location.coordinate.longitude);
    
    if (self.meteorClient.websocketReady){
        [self reportLocation:location];
    } else {
        self.lastLocation = location;
    }
    
}

-(void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    NSLog(@"Location error");
    NSLog(@"%@", error);
}

// this happens while we are running ( in the background, or from within our own app )
// only valid if meteor-app-Info.plist specifies a protocol to handle
- (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
{
    if (!url) {
        return NO;
    }

    // all plugins will get the notification, and their handlers will be called
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];

    return YES;
}

// repost all remote and local notification using the default NSNotificationCenter so multiple plugins may respond
- (void)            application:(UIApplication*)application
    didReceiveLocalNotification:(UILocalNotification*)notification
{
    // re-post ( broadcast )
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVLocalNotification object:notification];
}

#ifndef DISABLE_PUSH_NOTIFICATIONS

    - (void)                                 application:(UIApplication*)application
        didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
    {
        // re-post ( broadcast )
        NSString* token = [[[[deviceToken description]
            stringByReplacingOccurrencesOfString:@"<" withString:@""]
            stringByReplacingOccurrencesOfString:@">" withString:@""]
            stringByReplacingOccurrencesOfString:@" " withString:@""];

        [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotification object:token];
    }

    - (void)                                 application:(UIApplication*)application
        didFailToRegisterForRemoteNotificationsWithError:(NSError*)error
    {
        // re-post ( broadcast )
        [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotificationError object:error];
    }
#endif

#if __IPHONE_OS_VERSION_MAX_ALLOWED < 90000
- (NSUInteger)application:(UIApplication*)application supportedInterfaceOrientationsForWindow:(UIWindow*)window
#else
- (UIInterfaceOrientationMask)application:(UIApplication*)application supportedInterfaceOrientationsForWindow:(UIWindow*)window
#endif
{
    // iPhone doesn't support upside down by default, while the iPad does.  Override to allow all orientations always, and let the root view controller decide what's allowed (the supported orientations mask gets intersected).
    NSUInteger supportedInterfaceOrientations = (1 << UIInterfaceOrientationPortrait) | (1 << UIInterfaceOrientationLandscapeLeft) | (1 << UIInterfaceOrientationLandscapeRight) | (1 << UIInterfaceOrientationPortraitUpsideDown);

    return supportedInterfaceOrientations;
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication*)application
{
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
}

@end
