import {
    Button,
    ButtonGroup,
    Input,
    FormControl,
    FormErrorMessage,
    FormLabel,
    FormHelperText,
    Select,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

function DeplayModal(props) {
    const { isOpen, onClose, onSubmit } = props;
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader>Deploy Flow</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl>
                                <FormLabel>Title</FormLabel>
                                <Input type='title'
                                    id='title'
                                    placeholder='title'
                                    {...register('title', {
                                    required: 'This is required',
                                    minLength: { value: 4, message: 'Minimum length should be 4' },
                                    })} />
                                <FormErrorMessage>
                                    {errors.title && errors.title.message}
                                </FormErrorMessage>
                                <FormHelperText>Must be unique.</FormHelperText>
                                <FormLabel>Description</FormLabel>
                                <Input type='description'
                                    id='description'
                                    placeholder='description'
                                    {...register('description', {
                                        required: 'This is required',
                                        minLength: { value: 4, message: 'Minimum length should be 4' },
                                    })} />
                                <FormErrorMessage>
                                    {errors.description && errors.description.message}
                                </FormErrorMessage>
                                <FormHelperText>Provide a short description of what the strategy does.</FormHelperText>
                                <FormLabel>Access</FormLabel>
                                <Select id='access' defaultValue='pivate' {...register('access', )}>
                                    <option value='private'>Private</option>
                                    <option value='public'>Public</option>
                                </Select>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant='ghost' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button isLoading={isSubmitting} type='submit' colorScheme='blue'>Deploy</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}
export default DeplayModal