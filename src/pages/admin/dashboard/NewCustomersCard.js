import PropTypes from 'prop-types';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from '../../../ui-component/cards/MainCard';
import SkeletonTotalOrderCard from '../../../ui-component/cards/Skeleton/EarningCard'; 
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'; 

const NewCustomersCard = ({ isLoading, value }) => {
    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                // Hiển thị Skeleton loading khi dữ liệu chưa sẵn sàng
                <SkeletonTotalOrderCard />
            ) : (
                <MainCard border={false} content={false} sx={{ bgcolor: theme.palette.info.dark, color: '#fff' }}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.info.main,
                                                color: '#fff',
                                                mt: 1
                                            }}
                                        >
                                            <PeopleOutlineIcon fontSize="inherit" />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                            {value}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: theme.palette.primary.light }}>
                                    New Customers
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
};

NewCustomersCard.propTypes = {
    isLoading: PropTypes.bool,
    value: PropTypes.number,
};

export default NewCustomersCard;