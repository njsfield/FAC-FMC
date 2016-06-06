# Find my call recording

Our appliances can be configured to record some or all calls for a user or set of users depending on a set of policy criteria, or on demand by a user (for example if a user realised that they needed to keep a record of a particular conversation because of concerns or for regulatory reasons). 
Once recorded these are stored for a fixed 21-days before being deleted both to preserve the limited storage space on the appliance and as a policy to prevent indefinite long term storage. They are stored on the server, indexed by source and destination phone number, date and time.
There is a rudimentary UI on the unit itself that allows a list of call recordings for an individual user to be scrolled through in date/time order in order to select the desired recording which may then be either listened to, or downloaded as a .wav file.
Other interfaces we have also allow all recordings for a particular time period to be downloaded as a single .zip file for archiving purposes
In order to improve this service we would like to implement a server that stores and indexes recorded audio calls and allows them to be tagged and filtered so that they can be found again in future.

## Requirements

We want to provide a separate server which is capable of: 

 - Storing (archiving) call recordings in a more permanent fashion
 - Providing rich facilities to allow calls to be tagged, flexible retention criteria to be set
 - Perform complex searches to find a relevant recording by user, date, correspondent, tag
 - Possibly create boolean searches to combine multiple search criteria at once using and/or (advanced and not essential)
 - Possibly listening for conversation keywords via an optional external audio transcription service (advanced and not essential)

## Server architecture and data flow

A ‘Find my Call Server’ will be paired with one or more PBXs and will repeatedly poll (or be told via a webhook, API or similar - implementation TBD) for new call recordings on PBXs it is attached to. 
It will determine via meta-data sent with the recording, the user, correspondent, date and time and store the file in a local database along with this metadata, and a crypto checksum which is sent by the PBX to allow verification of the call data. 
It may also asynchronously send the file to an audio transcription service if configured to do so, and when it receives a transcript back, store this as searchable meta-data against the recording record.

## User journeys

Users want to be able to visit the site and find historic call recordings they have made by a wide variety of criteria. Some could be globally set and some could be created by users.
Admins will want the same functionality but will also want to find call recordings by any user in the companies they administer and set global policies and settings.

|Normal Users|Administrative Users|
|------------|--------------------|
|Visit the site and log in with their PBX login|Visit the site and log in with their PBX login|
|View their own call recordings|View their own call recordings|
|Filter their search on whether the calls were incoming or outgoing, user extension(s)/name, which company (if multiple), date and time|Filter their search on whether the calls were incoming or outgoing, user extension(s)/name, which company (if multiple), date and time|
|Tag each call recording using tags already created and new tags (created by the user)|Tag each call recording using tags already created and new tags (created by the user)|
||Tag each call recording using tags already created and new tags (created by the user)|
||View all call recordings in each company they are an admin for (Search, filter and tag this in the same way a user would)|
||Define tags per company they are an admin for|
||Set policies for each company they are an admin for: How long recordings should remain on the server; Whether or not to display call of a certain length (to remove short calls)|

## Nice for the future

 - Keyword listening via an optional external audio transcription service (in the spec just in case)
 - Boolean searching (in the spec just in case)
 - Keeping voicemail for different times per user
 - Sharing voicemails between users so they can view other people’s voicemails
 - And therefore hierarchical roles on a PBX
 - Better ways of looking up contacts using CDRs
