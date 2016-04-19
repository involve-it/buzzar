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
//  Shiners
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    self.viewController = [[MainViewController alloc] init];

    [self initLocation];

    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

-(void)initLocation
{
    NSLog(@"Init location");
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

-(void)reportLocation: (CLLocation *)location{
    NSString *deviceId = [self getDeviceId];
    NSString *oldDeviceId = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    NSLog(@"device ID: cordova: %@, ios: %@", deviceId, oldDeviceId);

    NSLog(@"Submitting location: %f, %f", location.coordinate.latitude, location.coordinate.longitude);

    /*NSDictionary *report = @{
                             @"deviceId": deviceId,
                             @"lat":[NSNumber numberWithDouble:location.coordinate.latitude],
                             @"lng":[NSNumber numberWithDouble:location.coordinate.longitude]
                             };*/

    NSString *reportString = [NSString stringWithFormat:@"{\"deviceId\": \"%@\", \"lat\": %f, \"lng\": %f}", deviceId, location.coordinate.latitude, location.coordinate.longitude];

    //NSData *postData = [reportString dataUsingEncoding:NSUTF8StringEncoding];
    //NSString *postLength = [NSString stringWithFormat:@"%lu", (unsigned long)[postData length]];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://192.168.1.61:3000/api/geolocation"]];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPMethod:@"POST"];
    [request setHTTPBody:[NSData dataWithBytes:[reportString UTF8String] length:strlen([reportString UTF8String])]];

    NSURLConnection *connection=[[NSURLConnection alloc] initWithRequest:request delegate:self];

    if (!connection){
        NSLog(@"Request failed");
    }

    /*[self.meteorClient callMethodName:@"reportLocation" parameters:@[report] responseCallback:^(NSDictionary *response, NSError *error) {
        if (error){
            NSLog(@"Location report error: %@", error);
        } else {
            NSLog(@"Location report successful");
        }
    }];
    self.lastLocation = nil;*/
}

-(void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations
{
    CLLocation *location = [locations lastObject];

    NSLog(@"Location reported");
    NSLog(@"%@", location);
    NSLog(@"latitude %+.6f, longitude %+.6f\n",
          location.coordinate.latitude,
          location.coordinate.longitude);

    [self reportLocation:location];
}

-(void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    NSLog(@"Location error");
    NSLog(@"%@", error);
}

@end
