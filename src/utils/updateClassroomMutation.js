import gql from 'graphql-tag';

const updateClassroomMutation = gql`
    mutation UpdateClassroomMutation(
        $id: ID!
        $classroomName: String
        $schoolAddress: String
        $schoolMeeting: DateTime
        $excursionDate: DateTime
        $directorName: String
        $directorPhone: String
        $directorEmail: String
        $teacherName: String
        $teacherEmail: String
        $teacherPhone: String
        $branchRepresentativeName: String
        $branchRepresentativeEmail: String
        $branchRepresentativePhone: String
        $branchAddress: String
        $fairDate: DateTime
        $fairTime: DateTime
        $semester: Int
        $year: Int
        $moneyGoalAmount: String
        $companyName: String
        $businessPurpose: String
        $businessDescription: String
        $childrenCount: String
        $kioskReadyTime: DateTime
        $fairEnd: DateTime
        $kioskPlace: String
        $fairNote: String
        $fairElectricity: String
        $fairAnnexationState: String
        $fairAnnexationNote: String
        $fairAgency: FairAgencyInput
    ) {
        updateClassroom(data: {
            id: $id,
            schoolAddress: $schoolAddress
            classroomName: $classroomName
            teacherName: $teacherName
            teacherPhone: $teacherPhone
            branchAddress: $branchAddress
            semester: $semester
            year: $year
            moneyGoalAmount: $moneyGoalAmount
            schoolMeeting: $schoolMeeting
            excursionDate: $excursionDate
            directorName: $directorName
            directorPhone: $directorPhone
            directorEmail: $directorEmail
            teacherEmail: $teacherEmail
            branchRepresentativeName: $branchRepresentativeName
            branchRepresentativeEmail: $branchRepresentativeEmail
            branchRepresentativePhone: $branchRepresentativePhone
            fairDate: $fairDate
            companyName: $companyName
            businessPurpose: $businessPurpose
            businessDescription: $businessDescription
            childrenCount: $childrenCount
            kioskReadyTime: $kioskReadyTime
            fairEnd: $fairEnd
            fairTime: $fairTime
            kioskPlace: $kioskPlace
            fairNote: $fairNote
            fairElectricity: $fairElectricity
            fairAnnexationState: $fairAnnexationState
            fairAnnexationNote: $fairAnnexationNote
            fairAgency: $fairAgency
        }) {
            id
            classroomName
            schoolAddress
            schoolMeeting
            excursionDate
            directorName
            directorPhone
            directorEmail
            teacherName
            teacherEmail
            teacherPhone
            branchRepresentativeName
            branchRepresentativeEmail
            branchRepresentativePhone
            branchAddress
            fairDate
            fairTime
            semester
            year
            moneyGoalAmount
            companyName
            businessPurpose
            businessDescription
            childrenCount
            kioskReadyTime
            fairEnd
            kioskPlace
            fairNote
            fairElectricity
            fairAnnexationState
            fairAnnexationNote
            fairAgency {
                id
                name
            }
        }
    }
`;

export default updateClassroomMutation;
