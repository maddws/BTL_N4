// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
// import { Calendar } from 'lucide-react-native';
// import Colors from '@/constants/colors';

// interface DatePickerProps {
//   date: Date;
//   onChange: (date: Date) => void;
//   label?: string;
//   placeholder?: string;
//   error?: string;
// }

// export default function DatePicker({
//   date,
//   onChange,
//   label,
//   placeholder = 'Chọn ngày',
//   error
// }: DatePickerProps) {
//   const [show, setShow] = useState(false);

//   const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     onChange(currentDate);
//   };

//   const showDatepicker = () => {
//     setShow(true);
//   };

//   const formatDate = (date: Date) => {
//     return date.toISOString().split('T')[0]; // YYYY-MM-DD format
//   };

//   return (
//     <View style={styles.container}>
//       {label && <Text style={styles.label}>{label}</Text>}

//       <TouchableOpacity
//         style={[styles.dateInput, error && styles.inputError]}
//         onPress={showDatepicker}
//       >
//         <Text style={[
//           styles.dateText,
//           date ? styles.dateTextSelected : styles.dateTextPlaceholder
//         ]}>
//           {date ? formatDate(date) : placeholder}
//         </Text>
//         <Calendar size={20} color={Colors.textLight} />
//       </TouchableOpacity>

//       {error && <Text style={styles.errorText}>{error}</Text>}

//       {show && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={date}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={onDateChange}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.text,
//     marginBottom: 8,
//   },
//   dateInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: Colors.card,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   dateText: {
//     fontSize: 14,
//   },
//   dateTextSelected: {
//     color: Colors.text,
//   },
//   dateTextPlaceholder: {
//     color: Colors.textLight,
//   },
//   inputError: {
//     borderColor: Colors.error,
//   },
//   errorText: {
//     fontSize: 12,
//     color: Colors.error,
//     marginTop: 4,
//   },
// });
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   StyleSheet
// } from 'react-native';
// import DateTimePicker, {
//   DateTimePickerEvent
// } from '@react-native-community/datetimepicker';
// import { Calendar } from 'lucide-react-native';
// import Colors from '@/constants/colors';

// interface DatePickerProps {
//   date: Date;
//   onChange: (date: Date) => void;
//   label?: string;
//   placeholder?: string;
//   error?: string;
// }

// export default function DatePicker({
//   date,
//   onChange,
//   label,
//   placeholder = 'Chọn ngày',
//   error
// }: DatePickerProps) {
//   const [show, setShow] = useState(false);

//   const onDateChange = (
//     event: DateTimePickerEvent,
//     selectedDate?: Date
//   ) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     onChange(currentDate);
//   };

//   const showDatepicker = () => {
//     setShow(true);
//   };

//   const formatDate = (d: Date) =>
//     d.toISOString().split('T')[0]; // YYYY-MM-DD

//   return (
//     <View style={styles.container}>
//       {label && <Text style={styles.label}>{label}</Text>}

//       <TouchableOpacity
//         style={[styles.input, error && styles.inputError]}
//         onPress={showDatepicker}
//         activeOpacity={0.7}
//       >
//         <Text
//           style={[
//             styles.text,
//             date ? styles.textSelected : styles.textPlaceholder
//           ]}
//         >
//           {date ? formatDate(date) : placeholder}
//         </Text>
//         <Calendar size={20} color={Colors.textLight} />
//       </TouchableOpacity>

//       {error && <Text style={styles.error}>{error}</Text>}

//       {show && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={date}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={onDateChange}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { marginBottom: 16 },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.text,
//     marginBottom: 8
//   },
//   input: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: Colors.card,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: Colors.border
//   },
//   inputError: { borderColor: Colors.error },
//   text: { fontSize: 14 },
//   textSelected: { color: Colors.text },
//   textPlaceholder: { color: Colors.textLight },
//   error: {
//     fontSize: 12,
//     color: Colors.error,
//     marginTop: 4
//   }
// });

// src/components/DatePicker.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '@/constants/colors';

interface DatePickerProps {
    date: Date;
    onChange: (date: Date) => void;
    label?: string;
    placeholder?: string;
    error?: string;
}

export default function DatePicker({
    date,
    onChange,
    label,
    placeholder = 'Chọn ngày',
    error,
}: DatePickerProps) {
    const [showCalendar, setShowCalendar] = useState(false);

    const formatted = date ? date.toISOString().split('T')[0] : '';

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                style={[styles.input, error && styles.inputError]}
                onPress={() => setShowCalendar(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.text, date ? styles.textSelected : styles.textPlaceholder]}>
                    {date ? formatted : placeholder}
                </Text>
                <CalendarIcon size={20} color={Colors.textLight} />
            </TouchableOpacity>

            {error && <Text style={styles.error}>{error}</Text>}

            {showCalendar && (
                <View style={styles.calendarWrapper}>
                    <Calendar
                        // onDayPress={(day) => {
                        //     setShowCalendar(false);
                        //     const [y, m, d] = day.dateString.split('-').map(Number);
                        //     onChange(new Date(y, m - 1, d));
                        // }}
                        onDayPress={(day) => {
                            setShowCalendar(false);
                            const [y, m, d] = day.dateString.split('-').map(Number);
                            // Sử dụng UTC để đảm bảo không bị lệch múi giờ
                            onChange(new Date(Date.UTC(y, m - 1, d)));
                        }}
                        markedDates={{
                            [formatted]: { selected: true },
                        }}
                        theme={{
                            selectedDayBackgroundColor: Colors.primary,
                            todayTextColor: Colors.primary,
                        }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 8,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.card,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    inputError: { borderColor: Colors.error },
    text: { fontSize: 14 },
    textSelected: { color: Colors.text },
    textPlaceholder: { color: Colors.textLight },
    error: {
        fontSize: 12,
        color: Colors.error,
        marginTop: 4,
    },
    calendarWrapper: {
        backgroundColor: Colors.card,
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 8,
    },
});
